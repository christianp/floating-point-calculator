port module Main exposing (..)
import Browser
import Browser.Events as BE
import Dict
import Ease
import Html exposing (Html, div)
import Html.Attributes as HA
import Html.Events as HE
import Json.Decode as D
import Json.Encode as E
import Svg exposing (svg, circle, ellipse, line, rect)
import Svg.Attributes as SA
import Svg.Events as SE
import Time exposing (Posix, posixToMillis)
import Tuple exposing (pair, first, second)

long_press_duration = 200

base_scale = 2

button_radius button = base_scale * (case button.onClick of
    DeletePoint _ -> 13
    ApplyUnaryOp _ -> 13
    _ -> 10
    )
touch_buffer            = base_scale * 20
new_point_radius        = base_scale * 15
static_press_radius     = base_scale * 5
hook_distance           = base_scale * 30
text_size               = base_scale * 10
point_padding           = base_scale * 10
derived_point_height    = base_scale * 20
key_translate_distance  = base_scale * 5

port saveLocalStorage : E.Value -> Cmd msg

port receiveLocalStorage : (E.Value -> msg) -> Sub msg

main = Browser.element 
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

type alias Vector = (Float, Float)

type TouchInfo = TouchInfo Int Float Float

type CompassDirection
    = Left
    | Right
    | Up
    | Down

type BinaryOp
    = Add
    | Subtract
    | Times
    | Divide

type UnaryOp
    = Square
    | SquareRoot
    | Exponent
    | NaturalLog

type OpApplication
    = Binary PointKey PointKey BinaryOp
    | Unary PointKey UnaryOp

type alias PointKey = Int

type PointKind
    = BasePoint
    | DerivedPoint OpApplication

type alias AnonymousPoint =
    { position : Vector
    , value : Float
    , kind : PointKind
    }
type alias Point =
    { id : PointKey
    , position : Vector
    , value : Float
    , kind : PointKind
    , name : String
    }

type PressType
    = NewPress
    | LongStaticPress
    | LongMovingPress
    | MovingPress

type PressSource
    = Mouse
    | Touch Int

type alias Press =
    { start_position: Vector
    , position : Vector
    , screen_start_position : Vector
    , screen_position : Vector
    , time : Posix
    , point : Maybe (Int,Point)
    , button : Maybe Button
    , kind : PressType
    , source : PressSource
    }

type alias Model =
    { idacc : PointKey
    , points : List Point
    , mouse : Vector
    , time : Maybe Posix
    , presses : List Press
    , pan : Vector
    , scale : Float
    , calculator_display : String
    , selected_point : Maybe PointKey
    , last_selected_point : Maybe PointKey
    , new_input : Bool
    , last_press_position : Vector
    , current_op : BinaryOp
    , input_focused : Bool
    }

type Msg
    = MouseMove Float Float
    | MouseDown
    | MouseUp
    | SetTime Posix
    | DeletePoint Int
    | FocusPoint PointKey
    | BlurPoint PointKey
    | NextOp Int
    | TouchStart (List TouchInfo)
    | TouchMove (List TouchInfo)
    | TouchEnd (List TouchInfo)
    | KeyPress String
    | SetName String
    | FocusInput
    | BlurInput
    | ApplyUnaryOp Int

type alias Button =
    { position : Vector
    , label : String
    , onClick: Msg
    , z_index: Int
    }

ff = String.fromFloat
fi = String.fromInt

dp_format : Int -> Float -> String
dp_format dp x =
    let
        s = ff x
        mdec = s |> (String.split ".") >> List.drop 1 >> List.head >> Maybe.map (String.length)
    in
        case mdec of
            Just i -> if i>dp then (String.dropRight (i-dp) s)++"…" else s
            Nothing -> s

strf : String -> List String -> String
strf template bits =
    let
        next_bit cbits = case cbits of
            a::rest -> (a,rest)
            [] -> ("",[])
    in
        first <| List.foldl (\chr -> \(out,cbits) -> 
            if chr=='%' then
                let
                    (suffix,nbits) = next_bit cbits
                in
                    (out++suffix, nbits)
            else
                (out++(String.fromChar chr), cbits)
        ) ("",bits) (String.toList template)

minall : List comparable -> Maybe comparable
minall = (List.map Just) >> (List.foldl (\a -> \b -> if b==Nothing then a else (Maybe.map2 min a b)) Nothing)

maxall : List comparable -> Maybe comparable
maxall = (List.map Just) >> (List.foldl (\a -> \b -> if b==Nothing then a else (Maybe.map2 max a b)) Nothing)

update_at : (a -> a) -> Int -> List a -> List a
update_at fn i = List.indexedMap (\j -> \x -> if j==i then fn x else x)

update_where : (a -> Bool) -> (a -> a) -> List a -> List a
update_where test fn = List.map (\x -> if test x then fn x else x)

indexOf : a -> List a -> Maybe Int
indexOf x = (List.indexedMap pair) >> List.filter (\(_,y) -> x == y) >> List.map first >> List.head

get : Int -> List a -> Maybe a
get i = List.drop i >> List.head

get_id : PointKey -> List {a | id : PointKey} -> Maybe {a | id : PointKey}
get_id id = List.filter (\p -> p.id == id) >> List.head

length : Vector -> Float
length (x,y) = sqrt (x*x + y*y)

dist : Vector -> Vector -> Float
dist (x1,y1) (x2,y2) =
    let
        dx = x2-x1
        dy = y2-y1
    in
        length (dx,dy)

normal : Vector -> Vector
normal (x,y) =
    let
        l = length (x,y)
    in
        if l==0 then (0,0) else (-y/l, x/l)

dot : Vector -> Vector -> Float
dot (x1,y1) (x2,y2) = x1*x2 + y1*y2

direction : Float -> Float -> Vector
direction t r =
    let
        theta = turns t
    in
        (r*(cos theta), r*(sin theta))

vangle : Vector -> Float
vangle (x,y) = atan2 y x

vadd : Vector -> Vector -> Vector
vadd (x1,y1) (x2,y2) = (x1+x2, y1+y2)

vsub : Vector -> Vector -> Vector
vsub (x1,y1) (x2,y2) =(x1-x2, y1-y2)

vmul : Float -> Vector -> Vector
vmul s (x,y) = (x*s, y*s)

vdiv : Float -> Vector -> Vector
vdiv s (x,y) = (x/s, y/s)

unit_vector : Vector -> Vector
unit_vector (x,y) =
    let
        l = length (x,y)
    in
        (x/l, y/l)

angle_bisector : Vector -> Vector -> Float -> Vector
angle_bisector v1 v2 dir =
    let
        (x1,y1) = unit_vector v1
        (x2,y2) = unit_vector v2
        d = dot (x1,y1) (x2,y2)
        tol = 0.1
        (nx,ny) = normal (x1,y1)
    in
        if d > 1-tol || d < -1+tol then (nx*dir,ny*dir) else unit_vector (x1+x2, y1+y2)

midpoint : Vector -> Vector -> Vector
midpoint (x1,y1) (x2,y2) = ((x1+x2)/2, (y1+y2)/2)

point_radius : Point -> Float
point_radius point = 
    let
        s = point_label_text point
    in
        text_size * ((toFloat << String.length) s)/2 + point_padding * (if is_derived point then 1 else 0)

apply_binary_op : BinaryOp -> Float -> Float -> Float
apply_binary_op op a b = case op of
    Add -> a + b
    Subtract -> a - b
    Times -> a * b
    Divide -> a / b

apply_unary_op : UnaryOp -> Float -> Float
apply_unary_op op x = case op of
    Square -> x^2
    SquareRoot -> sqrt x
    Exponent -> e ^ x
    NaturalLog -> logBase e x

point_value : Point -> Model -> Float
point_value point model = case point.kind of
    BasePoint -> point.value
    DerivedPoint (Binary id1 id2 op) ->
        case (get_id id1 model.points, get_id id2 model.points) of
            (Just p1, Just p2) -> 
                let
                    v1 = point_value p1 model
                    v2 = point_value p2 model
                in
                    apply_binary_op op v1 v2
            _ -> 0
    DerivedPoint (Unary id op) ->
        case get_id id model.points of
            Just p1 -> apply_unary_op op (point_value p1 model)
            _ -> 0

point_is_pressed : Point -> Model -> Bool
point_is_pressed point model = not (List.isEmpty (presses_on_point point model))

corners : Point -> (Vector,Vector)
corners p =
    let
        radius = point_radius p
        width = 2*radius
        height = derived_point_height
        (x,y) = p.position
    in
        ((x-width/2, y-height/2), (x+width/2, y+height/2))

distance_from_point : Vector -> Point -> Float
distance_from_point pos p = 
    let
        (x,y) = pos
        (cx,cy) = p.position
        ((x1,y1),(x2,y2)) = corners p
        width = x2-x1
        height = y2-y1
        dx = (abs (x-cx)) - width/2
        dy = (abs (y-cy)) - height/2
        d = max (length (dx,dy)) 0
        outside = length (max 0 dx, max 0 dy)
        inside = min (max dx dy) 0
        rect = inside + outside
        lcircle = (dist pos (x1,cy)) - (height/2)
        rcircle = (dist pos (x2,cy)) - (height/2)
        circles = min lcircle rcircle
    in
        case p.kind of
            BasePoint -> min rect circles
            DerivedPoint _ -> rect

distance_from_button : Vector -> Button -> Float
distance_from_button pos b = (dist pos b.position) - (button_radius b)

press_buffer : PressSource -> Float
press_buffer source = case source of
    Mouse -> 0
    Touch _ -> touch_buffer

pick_point : Float -> Vector -> List Point -> Maybe (Int,Point)
pick_point buffer pos = (List.indexedMap (\i -> \p -> ((i,p), distance_from_point pos p))) >> List.filter (\(_,d) -> d < buffer) >> List.sortBy second >> List.map first >> List.head

pick_button : Vector -> List Button -> Maybe Button
pick_button pos = (List.indexedMap (\i -> \b -> (b, distance_from_button pos b))) >> List.filter (\(_,d) -> d<0) >> List.reverse >> List.map first >> List.head

decode_event_vector : (Float -> Float -> a) -> D.Decoder a
decode_event_vector fn = 
    D.map2 fn
        (D.at ["detail", "x"] D.float)
        (D.at ["detail", "y"] D.float)

decode_vector : D.Decoder Vector
decode_vector = D.map2 pair (D.field "x" D.float) (D.field "y" D.float)

decode_touch msg =
    D.field "detail" <| D.map msg <| D.list (D.map3 TouchInfo
        (D.field "identifier" D.int)
        (D.at ["position","x"] D.float)
        (D.at ["position","y"] D.float)
    )

classList : List (String,Bool) -> Svg.Attribute Msg
classList = SA.class << String.join " " << ((List.filter second) >> (List.map first))

----------------------------------------

type alias Flags = D.Value

init_model : Flags -> Model
init_model flags = 
    let
        q = Debug.log "flags" (D.decodeValue load_model flags)
    in
        ((Result.withDefault blank_model) << (D.decodeValue load_model)) flags

blank_model =
    { idacc = 0
    , points = []
    , mouse = (100000,0)
    , time = Nothing
    , presses = []
    , pan = (0,0)
    , scale = 1
    , calculator_display = ""
    , selected_point = Nothing
    , last_selected_point = Nothing
    , new_input = True
    , last_press_position = (0,0)
    , current_op = Add
    , input_focused = False
    }

init : Flags -> (Model, Cmd Msg)
init flags = (init_model flags, Cmd.none)

subscriptions model = Sub.batch
    [ BE.onAnimationFrame SetTime
    ]

save : (Model, Cmd Msg) -> (Model, Cmd Msg)
save (model,cmd) = (model, Cmd.batch [cmd, (save_model >> saveLocalStorage) model])

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
    SetTime t -> ((set_time t >> update_press_kinds) model, Cmd.none)
    MouseDown -> (start_press model.mouse Mouse model, Cmd.none)
    MouseMove x y -> ((set_mouse (x,y) >> set_press_position Mouse (x,y) >> after_move) model, Cmd.none)
    MouseUp -> (end_press Mouse model, Cmd.none) |> save
    DeletePoint i -> (delete_indexed_point i model, Cmd.none) |> save
    FocusPoint id -> (focus_point id model, Cmd.none)
    BlurPoint id -> (blur_point id model, Cmd.none)
    NextOp i -> (increment_op i model, Cmd.none)
    TouchStart touches -> (start_touches touches model, Cmd.none)
    TouchMove touches -> ((move_touches touches >> after_move) model, Cmd.none)
    TouchEnd touches -> (end_touches touches model, Cmd.none) |> save
    KeyPress key -> (handle_keypress key model, Cmd.none) |> save
    SetName name -> (handle_set_name name model, Cmd.none) |> save
    FocusInput -> ({ model | input_focused = True, selected_point = model.last_selected_point }, Cmd.none)
    BlurInput -> ({ model | input_focused = False }, Cmd.none)
    ApplyUnaryOp i -> (apply_unary_op_to_point i model, Cmd.none)
--    _ -> (model, Cmd.none)

after_move : Model -> Model
after_move = move_points >> update_button_presses

set_mouse : Vector -> Model -> Model
set_mouse v model = { model | mouse = screen_transform v model }

update_presses : (Model -> Press -> Press) -> Model -> Model
update_presses fn model = { model | presses = List.map (fn model) model.presses }

update_press_source : PressSource -> (Press -> Press) -> List Press -> List Press
update_press_source source = update_where (\p -> p.source == source)

update_button_presses : Model -> Model
update_button_presses model = update_presses (\_ -> \p -> {p | button = pick_button p.position (get_buttons model)}) model

set_time : Posix -> Model -> Model
set_time t model = { model | time = Just t }

update_press_kinds : Model -> Model
update_press_kinds = update_presses <| \model -> \press -> 
    let
        moved = dist press.screen_position press.screen_start_position > static_press_radius
        nkind = case press.kind of
            NewPress -> 
                if moved then
                    MovingPress
                else if press_duration model press >= long_press_duration then LongStaticPress else NewPress
            LongStaticPress -> if moved then LongMovingPress else LongStaticPress
            _ -> press.kind
    in
        { press | kind = nkind }

op_text : OpApplication -> String
op_text opa = case opa of
    Binary _ _ op -> case op of
        Add -> "+"
        Subtract -> "-"
        Times -> "×"
        Divide -> "÷"
    Unary _ op -> case op of
        Square -> "x²"
        SquareRoot -> "√"
        Exponent -> "exp"
        NaturalLog -> "ln"

next_op : OpApplication -> OpApplication
next_op opa = case opa of
    Binary id1 id2 op -> 
        let
            nop = case op of
                Add -> Subtract
                Subtract -> Times
                Times -> Divide
                Divide -> Add
        in
            Binary id1 id2 nop

    Unary id op ->
        let
            nop = case op of
                Square -> SquareRoot
                SquareRoot -> Exponent
                Exponent -> NaturalLog
                NaturalLog -> Square
        in
            Unary id nop

is_derived : Point -> Bool
is_derived p = case p.kind of
    DerivedPoint _ -> True
    _ -> False

increment_value : Float -> Point -> Point
increment_value d p = case p.kind of
    BasePoint -> { p | value = p.value + d }
    _ -> p

update_values_with_id id model = case indexOf id (List.map (\p -> p.id) model.points) of
    Just i -> update_values i model
    Nothing -> model

update_values : Int -> Model -> Model
update_values i model = case get i model.points of
    Nothing -> model
    Just p ->
        let
            to_update = (List.indexedMap pair >> List.filter (second >> (is_derived_from p))) model.points
            nmodel = { model | points = update_at (set_value (point_value p model)) i model.points }
            update_step (j,p2) m = update_values j {m | points = update_at (set_value (point_value p2 m)) j m.points}
            updated = List.foldl update_step nmodel to_update
        in
            updated

set_value : Float -> Point -> Point
set_value value p = { p | value = value }

set_position : Vector -> Point -> Point
set_position pos p = { p | position = pos }

set_unary_op : UnaryOp -> Point -> Point
set_unary_op op p = case p.kind of
    DerivedPoint (Unary id _) -> { p | kind = DerivedPoint (Unary id op) }
    _ -> p

set_binary_op : BinaryOp -> Point -> Point
set_binary_op op p = case p.kind of
    DerivedPoint (Binary id1 id2 _) -> { p | kind = DerivedPoint (Binary id1 id2 op) }
    _ -> p

set_name : String -> Point -> Point
set_name name p = { p | name = name }

translate_point : Vector -> Point -> Point
translate_point v p = { p | position = vadd v p.position }

move_touches : List TouchInfo -> Model -> Model
move_touches touches model = List.foldl (\touch -> \m -> case touch of
    TouchInfo id x y -> set_press_position (Touch id) (x,y) m) model touches

is_touch press = case press.source of
    Touch _ -> True
    _ -> False

is_bg_touch press = press.point == Nothing && press.button == Nothing

is_pinching model = 
    let
        touches = List.filter is_touch model.presses
        bg_touches = List.filter is_bg_touch touches
    in
        List.length bg_touches == 2

set_press_position : PressSource -> Vector -> Model -> Model
set_press_position source pos model = 
    let
        mpress = (List.filter (\p -> p.source == source) >> List.head) model.presses
        d = case mpress of
            Nothing -> (0,0)
            Just press -> case (press.kind, press.point, press.button) of
                (MovingPress,Nothing,Nothing) -> 
                    if is_touch press && is_bg_touch press && is_pinching model then 
                        (0,0) 
                    else
                        vsub pos press.screen_position
                _ -> (0,0)

        tpan = vadd model.pan d
        touches = List.filter is_touch model.presses
        bg_touches = List.filter is_bg_touch touches
        (ma,mb) = (List.head bg_touches, (List.drop 1 >> List.head) bg_touches)
        mab = Maybe.andThen (\(a,b) -> if a.source == source then Just (b,a) else if b.source == source then Just (a,b) else Nothing) (Maybe.map2 pair ma mb)
        (ppan,pscale) = Maybe.withDefault (tpan,model.scale) <| Maybe.map (\(a,b) ->
            -- b is the point that has moved
            let
                d1 = dist a.screen_position b.screen_position
                d2 = dist a.screen_position pos
                diff = vsub pos b.screen_position
                s2 = d2/d1 * model.scale
                pan2 = (vadd (vmul s2 diff) model.pan)
            in
                (pan2, s2)
            ) mab
    in
        { model | pan = tpan, presses = update_press_source source (\p -> {p | position = screen_transform pos model, screen_position = pos}) model.presses }

screen_transform : Vector -> Model -> Vector
screen_transform v model = (vdiv model.scale (vsub v model.pan))

press_fold : (Press -> Model -> Model) -> Model -> Model
press_fold fn model = List.foldl fn model model.presses

press_source_fold : PressSource -> (Press -> Model -> Model) -> Model -> Model
press_source_fold source fn = press_fold (\p -> \m -> if p.source==source then fn p m else m)

start_touches : List TouchInfo -> Model -> Model
start_touches touches model =
    List.foldl (\touch -> \m ->
        case touch of
            TouchInfo id x y -> start_press (screen_transform (x,y) model) (Touch id) m
    ) model touches

start_press : Vector -> PressSource -> Model -> Model
start_press position source model = case model.time of
    Nothing -> model
    Just t -> 
        let
            ppos = position
            press = {start_position = ppos, position = ppos, screen_start_position = position, screen_position = position, source = source, time = t, point = pick_point (press_buffer source) position model.points, button = Nothing, kind = NewPress}
            point_id = Maybe.map (\(_,p) -> p.id) press.point
        in
            { model | presses = press::model.presses } |> select_point_with_id point_id |> update_button_presses

move_points : Model -> Model
move_points = press_fold (\press -> \model -> 
    case (press.kind, press.point) of
        (MovingPress, Just (i,op)) ->
            let
                (opx,opy) = op.position
                (px,py) = press.start_position
                (mx,my) = press.position
                npos = (opx+mx-px, opy+my-py)
            in
                { model | points = update_at (set_position npos) i model.points }
        _ -> model
    )

is_new_press : Press -> Bool
is_new_press press = press.kind == NewPress

is_long_press : Press -> Bool
is_long_press press = case press.kind of
    NewPress -> False
    MovingPress -> False
    LongMovingPress -> True
    LongStaticPress -> True

presses_on_point : Point -> Model -> List Press
presses_on_point point model = List.filterMap (\press -> if (case press.point of
    Just (_,p) -> p.id == point.id
    Nothing -> False) then Just press else Nothing) model.presses

press_duration : Model -> Press -> Int
press_duration model press = case model.time of
    Just t2 ->
        let
            t1 = press.time
            dt = (posixToMillis t2) - (posixToMillis t1)
        in
            dt
    _ -> 0

new_point_pos : Press -> Vector
new_point_pos press =
    let
        (x,y) = press.position
    in
        case press.source of
            Mouse -> (x,y)
            Touch _ -> (x,y-touch_buffer)

input_value : Model -> Float
input_value model = Maybe.withDefault 0 (String.toFloat model.calculator_display)

handle_press : PressSource -> Model -> Model
handle_press source = press_source_fold source <| \press -> \model ->
    case (press.button, press.point, press.kind) of
        (Just b, _, _) -> click_button b model
        (Nothing, Nothing, LongStaticPress) -> add_new_point (new_point_pos press) model
        (Nothing, Just (i,op1), LongMovingPress) -> 
            case pick_point (press_buffer press.source) press.position model.points of
                Just (j,p2) -> if i /= j then combine_points i j model else model
                Nothing -> model
        _ -> model

remove_press : PressSource -> Model -> Model
remove_press source model = { model | presses = List.filter (\s -> s.source /= source) model.presses }

end_touches : List TouchInfo -> Model -> Model
end_touches touches model = List.foldl (\touch -> \m -> case touch of
    TouchInfo id x y -> end_press (Touch id) m
    ) model touches

end_press : PressSource -> Model -> Model
end_press source = (handle_press source) >> (remove_press source)

click_button : Button -> Model -> Model
click_button b model = first (update b.onClick model)

select_point : Point -> Model -> Model
select_point p model = { model | selected_point = Just p.id, last_selected_point = Just p.id, calculator_display = ff p.value, new_input = True }

select_point_with_id : Maybe PointKey -> Model -> Model
select_point_with_id mid model = case mid of
    Just id -> 
        let
            mp = get_id id model.points
        in
            case mp of
                Just p -> select_point p model
                Nothing -> model
    Nothing -> { model | selected_point = Nothing, last_selected_point = Nothing }

add_new_point : Vector -> Model -> Model
add_new_point pos model = add_point { position = pos, value = input_value model, kind = BasePoint } model

add_point : AnonymousPoint -> Model -> Model
add_point ap model = 
    let
        p = { id = model.idacc, position = ap.position, value = ap.value, kind = ap.kind, name = "" }
    in
        { model | points = p::model.points, idacc = model.idacc+1} |> select_point_with_id (Just p.id)

delete_indexed_point : Int -> Model -> Model
delete_indexed_point i model = case get i model.points of
    Just p -> { model | points = remove_point p model.points}
    Nothing -> model

delete_id_point id model = case get_id id model.points of
    Just p -> { model | points = remove_point p model.points}
    Nothing -> model

focus_point : PointKey -> Model -> Model
focus_point id model = select_point_with_id (Just id) model

blur_point id model = if model.selected_point == Just id then (\m -> { m | last_selected_point = model.selected_point }) (select_point_with_id Nothing model) else model

increment_op : Int -> Model -> Model
increment_op i model = 
    let
        fn p = case p.kind of
            DerivedPoint op_application -> { p | kind = DerivedPoint (next_op op_application) }
            _ -> p
    in 
        { model | points = update_at fn i model.points } |> update_values i

remove_point : Point -> List Point -> List Point
remove_point p points = 
    remove_derived_points p (List.filter (\p2 -> p.id /= p2.id) points)

is_derived_from : Point -> Point -> Bool
is_derived_from p p2 = case p2.kind of
    DerivedPoint (Binary id1 id2 _) -> id1==p.id || id2==p.id
    DerivedPoint (Unary id _) -> id==p.id
    _ -> False

remove_derived_points : Point -> List Point -> List Point
remove_derived_points p points =
    let
        derived_points = List.filter (is_derived_from p) points
    in
        List.foldl remove_point points derived_points

combine_points : Int -> Int -> Model -> Model
combine_points i j model = case (get i model.points, get j model.points) of
    (Just p1, Just p2) -> 
        let
            (mx,my) = midpoint p1.position p2.position
            (dx,dy) = vsub p1.position p2.position
            (nx,ny) = normal (dx,dy)
            pos = (mx + hook_distance*nx, my + hook_distance*ny)
            op = model.current_op
            value = apply_binary_op op p1.value p2.value
        in
            add_point {position = pos, value = value, kind = DerivedPoint (Binary p1.id p2.id op)} model
    _ -> model

apply_unary_op_to_point : Int -> Model -> Model
apply_unary_op_to_point i model = case get i model.points of
    Just p ->
        let
            hook_pos = vsub p.position (0, hook_distance)
            pos = vsub hook_pos (0, hook_distance)
            op = Square
            value = apply_unary_op op p.value
        in
            add_point {position = pos, value = value, kind = DerivedPoint (Unary p.id op)} model
    _ -> model

maybe_view : Maybe (Html Msg) -> Html Msg
maybe_view = Maybe.withDefault (Svg.g [] [])

typable_keys = String.words "0 1 2 3 4 5 6 7 8 9"

binary_op_keys = Dict.fromList
    [ ("+", Add)
    , ("-", Subtract)
    , ("*", Times)
    , ("×", Times)
    , ("/", Divide)
    , ("÷", Divide)
    ]

unary_op_keys = Dict.fromList
    [ ("s", Square)
    , ("r", SquareRoot)
    , ("e", Exponent)
    , ("l", NaturalLog)
    ]

action_keys = Dict.fromList
    [ ("Backspace", backspace)
    , (".", decimal_separator)
    , ("-", minus)
    , ("Enter", enter)
    , ("Delete", delete)
    , ("ArrowUp", arrowup)
    , ("ArrowDown", arrowdown)
    , ("ArrowLeft", arrowleft)
    , ("ArrowRight", arrowright)
    ]

handle_keypress : String -> Model -> Model
handle_keypress key model = 
    let
        q = Debug.log "keypress" key
        handlers = List.foldl (\fn -> \a -> a >> fn key) identity [handle_typable_key, handle_action_key, handle_binary_op_key, handle_unary_op_key]
    in
        if model.input_focused then model else handlers model

get_selected_point : Model -> Maybe Point
get_selected_point model = Maybe.andThen (\id -> get_id id model.points) model.selected_point

handle_typable_key key model =
    if List.member key typable_keys then
        let
            base_display = if model.new_input then "" else model.calculator_display
        in
            { model | calculator_display = base_display ++ key, new_input = False }
    else 
        model

handle_action_key key = (Maybe.withDefault identity (Dict.get key action_keys))

handle_binary_op_key : String -> Model -> Model
handle_binary_op_key key model =
    case Dict.get key binary_op_keys of
        Just op -> (update_selected_point (set_binary_op op) >> update_selected_point_value) model
        _ -> model

handle_unary_op_key : String -> Model -> Model
handle_unary_op_key key model =
    case Dict.get key unary_op_keys of
        Just op -> (update_selected_point (set_unary_op op) >> update_selected_point_value) model
        _ -> model

backspace model = { model | calculator_display = String.dropRight 1 model.calculator_display, new_input = False }

minus model = 
    let
        s = model.calculator_display
        point_kind = Maybe.map (\p -> p.kind) (get_selected_point model)
    in 
        case point_kind of
            Just (DerivedPoint _) -> model
            _ -> { model | calculator_display = if String.startsWith "-" s then String.dropLeft 1 s else "-"++s }

decimal_separator model = 
    let
        s = model.calculator_display
    in
        { model | calculator_display = if String.contains "." s then s else s++"." }

update_selected_point_value model = case model.selected_point of
    Just id -> update_values_with_id id model
    Nothing -> model

enter model = case String.toFloat model.calculator_display of
    Just v -> { model | new_input = True } |> update_selected_point (set_value v) |> update_selected_point_value
    _ -> model

delete model = case model.selected_point of
    Nothing -> model
    Just id -> delete_id_point id model

update_selected_point : (Point -> Point) -> Model -> Model
update_selected_point fn model = { model | points = update_where (\p -> model.selected_point == Just p.id) fn model.points }

translate_selected_point : Vector -> Model -> Model
translate_selected_point v model = case model.selected_point of
    Nothing -> { model | pan = vsub model.pan v }
    Just _ -> update_selected_point (translate_point v) model

arrowup = translate_selected_point (0,-key_translate_distance)
arrowdown = translate_selected_point (0,key_translate_distance)
arrowleft = translate_selected_point (-key_translate_distance,0)
arrowright = translate_selected_point (key_translate_distance,0)

handle_set_name name model = update_selected_point (set_name name) model

view : Model -> Html Msg
view model =
    div 
    [ HA.id "calculator"
    , HA.attribute "tabindex" "0"
    , HE.on "keydown" (D.map KeyPress (D.field "key" D.string))
    ]
    [ view_board model
    , view_input model
    ]

view_board : Model -> Html Msg
view_board model = svg 
    ([SA.class "board"]++(main_events model) )
    [Svg.g [SA.transform (strf "translate (% %) scale (%)" [(ff << first) model.pan, (ff << second) model.pan, ff model.scale])]
        [ view_new_points model
        , show_new_lines model
        , view_derivations model
        , view_points model
        , view_buttons model
        ]
    ]

main_events : Model -> List (Svg.Attribute Msg)
main_events model =
    [ SE.on "svgmove" <| decode_event_vector MouseMove
    , SE.onMouseUp MouseUp
    , SE.onMouseDown MouseDown
    , SE.on "svgtouchstart" <| decode_touch TouchStart
    , SE.on "svgtouchmove" <| decode_touch TouchMove
    , SE.on "svgtouchend" <| decode_touch TouchEnd
    ]

circle_pos : Vector -> List (Svg.Attribute Msg)
circle_pos (x,y) = [(SA.cx << ff) x, (SA.cy << ff) y]

svg_pos : Vector -> List (Svg.Attribute Msg)
svg_pos (x,y) = [(SA.x << ff) x, (SA.y << ff) y]

press_progress : Bool -> Model -> Press -> Float
press_progress allow_move model press = 
    case press.kind of
        NewPress -> Ease.inOutCubic <| ((toFloat << (press_duration model)) press) / long_press_duration
        LongStaticPress -> 1
        LongMovingPress -> if allow_move then 1 else 0
        _ -> 0

view_new_points : Model -> Html Msg
view_new_points model =
    let
        is_making_new_point press = (press.button, press.point) == (Nothing,Nothing)
        view_new_point press =
            let
                t = press_progress False model press
                radius = 1 + (new_point_radius-1)*t
            in
                circle ([classList [("making-new-point", True)], (SA.r << ff) radius, (SA.fillOpacity << ff) t]++(circle_pos (new_point_pos press))) []
    in
        Svg.g [SA.id "new-points"] (List.map view_new_point (List.filter is_making_new_point model.presses))

view_derivations : Model -> Html Msg
view_derivations model =
    Svg.g [SA.id "derivations"] ((List.indexedMap (view_derivation model) >> List.filterMap identity) model.points)

derivation_hook_position : Point -> Model -> Vector
derivation_hook_position point model =
    case point.kind of
        DerivedPoint (Binary id1 id2 op) -> 
            case (get_id id1 model.points, get_id id2 model.points) of
                (Just p1, Just p2) ->
                    let
                        (x1,y1) = p1.position
                        (nx,ny) = normal (vsub p2.position p1.position)
                        (x,y) = point.position
                        (hx,hy) = (x + nx*hook_distance, y + ny*hook_distance)
                    in
                        (hx,hy)
                _ -> (0,0)
        DerivedPoint (Unary id op) -> vadd point.position (0,hook_distance)
        _ -> (0,0)

point_along : Vector -> Vector -> Float -> Vector
point_along v1 v2 t = vadd v1 (vmul t (vsub v2 v1))

arrows : Vector -> Vector -> List (Svg.Svg Msg)
arrows a b =
    let
        arrow_space = 45
        arrow angle (ax,ay) = Svg.path [SA.class "arrow", SA.d "M 9 0 L -4 7 L -2 0 L -4 -7 z", SA.transform (strf "translate (% %) rotate (%)" (List.map ff [ax,ay,angle*180/pi]))] []
        d = dist a b
        num_arrows = floor (d/arrow_space)
    in
        List.map (point_along a b >> arrow (vangle (vsub b a))) (if num_arrows>1 then List.map (toFloat >> (\t -> t*arrow_space/d)) (List.range 1 num_arrows) else [0.5])

view_derivation : Model -> Int -> Point -> Maybe (Html Msg)
view_derivation model i point = 
    case point.kind of
        DerivedPoint (Binary id1 id2 op) -> 
            case (get_id id1 model.points, get_id id2 model.points) of
                (Just p1, Just p2) -> Just (
                        let
                            (x1,y1) = p1.position
                            (x2,y2) = p2.position
                            (x,y) = point.position
                            (hx,hy) = derivation_hook_position point model
                            lines = strf "M % % L % % L % % M % % L % %" (List.map ff [x1,y1,hx,hy,x,y,x2,y2,hx,hy])
                        in
                            Svg.g 
                                [SA.class "derivation"]
                                (  [ Svg.path [SA.class "lines", SA.d lines] [] ]
                                ++ (arrows (x1,y1) (hx,hy))
                                ++ (arrows (x2,y2) (hx,hy))
                                )
                    )
                _ -> Nothing
        DerivedPoint (Unary id op) ->
            case get_id id model.points of
                Just p1 -> Just (
                    let
                        (x1,y1) = p1.position
                        (x,y) = point.position
                        (hx,hy) = derivation_hook_position point model
                        lines = strf "M % % L % % L % %" (List.map ff [x1,y1,hx,hy,x,y])
                    in
                        Svg.g
                            [SA.class "derivation"]
                            (  [ Svg.path [SA.class "lines", SA.d lines] [] ]
                            ++ (arrows (x1,y1) (hx,hy))
                            )
                    )
                Nothing -> Nothing

        _ -> Nothing

view_points : Model -> Html Msg
view_points model =
    Svg.g [SA.id "points"] (List.indexedMap (view_point model) (List.reverse model.points))

up_triangle : Float -> Vector -> Html Msg
up_triangle size (x,y) =
    let
        (cx,cy) = (x,y+size*0.8)
        w = size*0.5
        h = size*0.3
        d = strf "M % % L % % L % % z" (List.map ff [cx-w,cy, cx,cy+h, cx+w,cy])
    in
        Svg.path [SA.d d, SA.class "increment up"] []

down_triangle : Float -> Vector -> Html Msg
down_triangle size (x,y) =
    let
        (cx,cy) = (x,y-size*0.8)
        w = size*0.5
        h = size*0.3
        d = strf "M % % L % % L % % z" (List.map ff [cx-w,cy, cx,cy-h, cx+w,cy])
    in
        Svg.path [SA.d d, SA.class "increment up"] []

point_label_text : Point -> String
point_label_text point = dp_format 3 point.value

speech_bubble dir pos text =
    let
        dir_class = case dir of
            Left -> "left"
            Right -> "right"
            Up -> "up"
            Down -> "down"
        width = text_size * (String.length text) 
        height = text_size
        padding = text_size * 0.3
        bubble_path = strf "M " []
    in
        Svg.g [classList [("speech-bubble",True),(dir_class,True)]]
        [ Svg.path [SA.class "bubble", SA.d bubble_path] []
        , Svg.text_ (svg_pos pos) [Svg.text text]
        ]

view_point : Model -> Int -> Point -> Svg.Svg Msg
view_point model i point =
    let
        is_pressed = point_is_pressed point model
        t = Maybe.withDefault 0 (maxall (List.map (press_progress True model) model.presses))
        (x,y) = point.position
        (mx,my) = model.mouse
        radius = point_radius point
        ((x1,y1),(x2,y2)) = corners point
        width = x2-x1
        height = y2-y1
        hovered = pick_point (press_buffer Mouse) model.mouse model.points == Just (i,point)
        selected = model.selected_point == Just point.id
        shape = case point.kind of
            DerivedPoint _ -> rect ([SA.class "container", (SA.x << ff) (x-width/2), (SA.y << ff) (y-height/2), (SA.width << ff) width, (SA.height << ff) height]) []
            BasePoint -> Svg.path [SA.class "container", SA.d (strf "M % % L % % A % % 0 0 1 % % L % % A % % 0 0 1 % %" (List.map ff [x1, y1, x2, y1, height/2, height/2, x2, y2, x1, y2, height/2, height/2, x1, y1]))] []
        pressing_shape = case point.kind of
            DerivedPoint _ -> rect ([SA.class "pressing", (SA.x << ff) (x-width*t/2), (SA.y << ff) (y-height*t/2), (SA.width << ff) (width*t), (SA.height << ff) (height*t)]) []
            BasePoint -> circle ([SA.class "pressing", SA.r <| ff <| (point_radius point)*t]++(circle_pos point.position)) []

        label = Svg.text_ ([SA.class "label"]++(svg_pos point.position)) [Svg.text (point_label_text point)]
        name_label_pos = case point.kind of
            DerivedPoint _ -> vadd point.position (width/2+10,0)
            BasePoint -> vadd point.position (0,height)
        name_label = Svg.text_ ([SA.class "name"]++(svg_pos name_label_pos)) [Svg.text point.name]
        kind_class = case point.kind of
            DerivedPoint _ -> "derived"
            BasePoint -> "base"
    in
        Svg.g 
            [ classList [("point",True),("hover",hovered),("pressed",is_pressed),("selected",selected),(kind_class,True)]
            , HA.attribute "tabindex" "0"
            , HE.onFocus (FocusPoint point.id)
            , HE.onBlur (BlurPoint point.id)
            ]
            [ shape
            , pressing_shape
            , label
            , name_label
            ]

show_new_lines : Model -> Html Msg
show_new_lines model = 
    Svg.g [SA.id "new-lines"]
    (List.filterMap (\press ->
        case (press.kind, press.point) of
            (LongMovingPress, Just (i,op)) -> Just (
                line [SA.id "new-line", (SA.x1 << ff << first) op.position, (SA.y1 << ff << second) op.position, (SA.x2 << ff << first) press.position, (SA.y2 << ff << second) press.position] []
                )
            _ -> Nothing
        ) model.presses)

get_buttons : Model -> List Button
get_buttons model =
    let
        point_buttons = List.indexedMap (get_point_buttons model) model.points |> List.concat
    in
        (List.reverse >> List.sortBy (\b -> b.z_index)) point_buttons

get_point_buttons : Model -> Int -> Point -> List Button
get_point_buttons model i point =
    let
        button_offset = 2 * derived_point_height
        is_close_press press =
            let
                pressing = case press.point of
                    Just (_,p) -> p.id == point.id
                    Nothing -> False
                mdist = dist press.position point.position
            in
                pressing && mdist < (point_radius point) + 2*button_offset && is_long_press press
        close_presses = List.filter is_close_press model.presses
        has_close_press = not (List.isEmpty close_presses)
        controls = 
            if has_close_press then 
                [ { position = (vadd point.position (direction (-2/6) button_offset)), label = "♲", onClick = DeletePoint i, z_index = 1 } 
                , { position = (vadd point.position (direction (-1/6) button_offset)), label = "x²", onClick = ApplyUnaryOp i, z_index = 1} 
                ]
            else
                []
        hooks = case point.kind of
            DerivedPoint op -> [ { position = derivation_hook_position point model, label = op_text op, onClick = NextOp i, z_index = 0 } ]
            _ -> []
    in
        controls ++ hooks

view_buttons : Model -> Html Msg
view_buttons model =
    let
        buttons = get_buttons model
    in
        Svg.g 
            [SA.id "buttons"]
            (List.map (view_button model) buttons)

view_button : Model -> Button -> Html Msg
view_button model button =
    let
        hovered = pick_button model.mouse (get_buttons model) == Just button
        class = case button.onClick of
            NextOp _ -> "next-op"
            DeletePoint _ -> "delete-point"
            _ -> "generic"
        size = button_radius button
    in
        Svg.g [classList [("button",True), ("hover",hovered), (class,True)]]
        [ circle ([SA.class "container", (SA.r << ff) size]++(circle_pos button.position)) []
        , Svg.text_ ([SA.class "label"]++(svg_pos button.position)) [Svg.text button.label]
        ]


view_input : Model -> Html Msg
view_input model =
    let
        q = 1
        name_display = Maybe.withDefault "" (Maybe.map (\p -> p.name) (get_selected_point model))
    in
        div [HA.id "input"]
        ( [ Html.div [HA.id "line-display"] [Html.text model.calculator_display] ]
          ++(if model.selected_point == Nothing then [] else
              [ Html.label [HA.id "name-input"] 
                [ Html.input 
                    [ HA.value name_display
                    , HE.onInput SetName
                    , HE.onFocus FocusInput
                    , HE.onBlur BlurInput
                    , HA.placeholder "Hi! My name is:"
                    ] 
                    []
                ]
              ]
            )
          ++(view_input_buttons model)
--          ++[debug_text model]
        )

view_input_buttons model = List.map (\(label,msg,class) -> Html.button [HA.type_ "button", HA.class class, HE.onClick msg] [Html.text label])
    [ ("0", KeyPress "0","digit-0")
    , ("1", KeyPress "1","digit-1")
    , ("2", KeyPress "2","digit-2")
    , ("3", KeyPress "3","digit-3")
    , ("4", KeyPress "4","digit-4")
    , ("5", KeyPress "5","digit-5")
    , ("6", KeyPress "6","digit-6")
    , ("7", KeyPress "7","digit-7")
    , ("8", KeyPress "8","digit-8")
    , ("9", KeyPress "9","digit-9")
    , (".", KeyPress ".","decimal-separator")
    , ("⌫", KeyPress "Backspace", "delete")
    , ("=", KeyPress "Enter", "enter")
    , (op_text (Binary 0 0 Add), KeyPress "+", "add")
    , (op_text (Binary 0 0 Subtract), KeyPress "-", "subtract")
    , (op_text (Binary 0 0 Times), KeyPress "×", "times")
    , (op_text (Binary 0 0 Divide), KeyPress "÷", "divide")
    ]

save_model : Model -> E.Value
save_model model = E.object
    [ ("pan", encode_vector model.pan)
    , ("scale", E.float model.scale)
    , ("points", E.list (save_point) model.points)
    ]

encode_vector : Vector -> E.Value
encode_vector (x,y) = E.object
    [ ("x", E.float x)
    , ("y", E.float y)
    ]

save_point : Point -> E.Value
save_point p = E.object
    [ ("id", E.int p.id)
    , ("position", encode_vector p.position)
    , ("value", E.float p.value)
    , ("kind", encode_point_kind p.kind)
    , ("name", E.string p.name)
    ]

encode_point_kind : PointKind -> E.Value
encode_point_kind kind = case kind of
    BasePoint -> E.object [("kind",E.string "base")]
    DerivedPoint opa -> case opa of
        Binary id1 id2 op -> E.object
            [ ("kind", E.string "derived binary")
            , ("id1", E.int id1)
            , ("id2", E.int id2)
            , ("op", (E.string << op_text) opa)
            ]
        Unary id op -> E.object
            [ ("kind", E.string "derived unary")
            , ("id", E.int id)
            , ("op", (E.string << op_text) opa)
            ]

load_model : D.Decoder Model
load_model =
    D.map3 (\pan -> \scale -> \points -> { blank_model | pan = pan, scale = scale, points = points, idacc = (Maybe.withDefault 0 (maxall (List.map (\p -> p.id) points))) + 1 })
        (D.field "pan" decode_vector)
        (D.field "scale" D.float)
        (D.field "points" (D.list load_point))

load_point : D.Decoder Point
load_point =
    D.map5 (\id -> \position -> \value -> \kind -> \name -> { id = id, position = position, value = value, kind = kind, name = name })
        (D.field "id" D.int)
        (D.field "position" decode_vector)
        (D.field "value" D.float)
        (D.field "kind" decode_point_kind)
        (D.field "name" D.string)

decode_point_kind : D.Decoder PointKind
decode_point_kind = D.andThen (\kind -> case kind of
    "base" -> D.succeed BasePoint
    "derived binary" -> D.map3 (\id1 -> \id2 -> \op -> DerivedPoint (Binary id1 id2 op))
        (D.field "id1" D.int)
        (D.field "id2" D.int)
        (D.field "op" decode_binary_op)
    "derived unary" -> D.map2 (\id -> \op -> DerivedPoint (Unary id op))
        (D.field "id" D.int)
        (D.field "op" decode_unary_op)
    x -> D.fail <| "Trying to decode a point, but " ++ x ++ " is not a recognised kind of point."
    ) (D.field "kind" D.string)

decode_binary_op : D.Decoder BinaryOp
decode_binary_op = D.andThen (\t -> case t of
    "+" -> D.succeed Add
    "-" -> D.succeed Subtract
    "×" -> D.succeed Times
    "÷" -> D.succeed Divide
    x -> D.fail <| "Trying to decode a binary operation, but " ++ x ++ " is not a recognised operation."
    ) D.string

decode_unary_op : D.Decoder UnaryOp
decode_unary_op = D.andThen (\t -> case t of 
    "x²" -> D.succeed Square
    "√" -> D.succeed SquareRoot
    "exp" -> D.succeed Exponent
    "ln" -> D.succeed NaturalLog
    x -> D.fail <| "Trying to decode a binary operation, but " ++ x ++ " is not a recognised operation."
    ) D.string

debug_text model = Html.div [] [Html.text <| (Debug.toString model.pan)]
