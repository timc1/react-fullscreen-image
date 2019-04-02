var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import * as React from 'react';
import './fullscreen.css';
var clickEvent = isMobile() ? 'touchstart' : 'click';
function reducer(state, action) {
    switch (action.type) {
        case ImageGroup.actions.toggleExpand:
            return __assign({}, state, { currentFocusedImageIndex: action.payload.id, isImageGroupExpanded: true, shouldAnimate: false });
        case ImageGroup.actions.toggleExpandAnimate:
            return __assign({}, state, { currentFocusedImageIndex: action.payload.id, isImageGroupExpanded: true, shouldAnimate: true });
        case ImageGroup.actions.toggleCloseAnimate:
            return __assign({}, state, { currentFocusedImageIndex: -1, isImageGroupExpanded: false, shouldAnimate: true });
        default:
            throw new Error("No case defined for type '" + action.type + "'.");
    }
}
export function ImageGroup(_a) {
    var _b = _a.transitionMs, transitionMs = _b === void 0 ? 250 : _b, children = _a.children;
    var previousImageButton = React.useRef(null);
    var nextImageButton = React.useRef(null);
    var isAnimating = React.useRef(false);
    var _c = React.useReducer(reducer, {
        currentFocusedImageIndex: -1,
        isImageGroupExpanded: false,
        shouldAnimate: true,
    }), state = _c[0], dispatch = _c[1];
    var _d = mapPropsToChildren(children, function (child, index) {
        return React.cloneElement(child, {
            'data-fullscreen-id': index,
            isFocused: index === state.currentFocusedImageIndex,
            shouldAnimate: state.shouldAnimate,
            isImageGroupExpanded: state.isImageGroupExpanded,
            transitionMs: transitionMs,
            onClick: function () {
                if (!isAnimating.current) {
                    if (state.shouldAnimate) {
                        isAnimating.current = true;
                        setTimeout(function () {
                            isAnimating.current = false;
                        }, transitionMs);
                    }
                    if (index === state.currentFocusedImageIndex) {
                        dispatch({
                            type: ImageGroup.actions.toggleCloseAnimate,
                        });
                    }
                    else {
                        dispatch({
                            type: state.currentFocusedImageIndex === -1
                                ? ImageGroup.actions.toggleExpandAnimate
                                : ImageGroup.actions.toggleExpand,
                            payload: {
                                id: index,
                            },
                        });
                    }
                }
            },
        });
    }), updatedChildren = _d.updatedChildren, numberOfImageChildren = _d.numberOfImageChildren;
    React.useEffect(function () {
        var clickListener = function (e) {
            if (e.target.hasAttribute('data-fullscreen-group')) {
                dispatch({
                    type: ImageGroup.actions.toggleCloseAnimate,
                });
            }
        };
        var keyDownListener = function (e) {
            if (state.currentFocusedImageIndex !== -1) {
                if (e.key === 'Escape') {
                    dispatch({
                        type: ImageGroup.actions.toggleCloseAnimate,
                    });
                }
                if (e.key === 'ArrowRight') {
                    if (nextImageButton.current)
                        nextImageButton.current.focus();
                    if (state.currentFocusedImageIndex + 1 === numberOfImageChildren) {
                        dispatch({
                            type: ImageGroup.actions.toggleExpand,
                            payload: {
                                id: 0,
                            },
                        });
                    }
                    else {
                        dispatch({
                            type: ImageGroup.actions.toggleExpand,
                            payload: {
                                id: state.currentFocusedImageIndex + 1,
                            },
                        });
                    }
                }
                if (e.key === 'ArrowLeft') {
                    if (previousImageButton.current)
                        previousImageButton.current.focus();
                    if (state.currentFocusedImageIndex - 1 === -1) {
                        dispatch({
                            type: ImageGroup.actions.toggleExpand,
                            payload: {
                                id: numberOfImageChildren - 1,
                            },
                        });
                    }
                    else {
                        dispatch({
                            type: ImageGroup.actions.toggleExpand,
                            payload: {
                                id: state.currentFocusedImageIndex - 1,
                            },
                        });
                    }
                }
            }
        };
        var resizeListener = function () {
            dispatch({
                type: ImageGroup.actions.toggleCloseAnimate,
            });
            window.removeEventListener('resize', resizeListener);
        };
        var scrollAnimationId = -1;
        var initialOffset = 0;
        var scrollListener = function () {
            scrollAnimationId = requestAnimationFrame(scrollListener);
            var difference = Math.abs(initialOffset - window.pageYOffset);
            if (difference > 80) {
                dispatch({
                    type: ImageGroup.actions.toggleCloseAnimate,
                });
            }
        };
        if (state.isImageGroupExpanded) {
            window.addEventListener(clickEvent, clickListener);
            window.addEventListener('keydown', keyDownListener);
            window.addEventListener('resize', resizeListener);
            initialOffset = window.pageYOffset;
            scrollAnimationId = requestAnimationFrame(scrollListener);
        }
        else {
            window.removeEventListener(clickEvent, clickListener);
            window.removeEventListener('keydown', keyDownListener);
            window.removeEventListener('resize', resizeListener);
            cancelAnimationFrame(scrollAnimationId);
        }
        return function () {
            window.removeEventListener(clickEvent, clickListener);
            window.removeEventListener('keydown', keyDownListener);
            window.removeEventListener('resize', resizeListener);
            cancelAnimationFrame(scrollAnimationId);
        };
    }, [
        state.isImageGroupExpanded,
        numberOfImageChildren,
        state.currentFocusedImageIndex,
    ]);
    return (React.createElement("div", { "data-fullscreen-group": "", className: "fullscreen-group" + (state.isImageGroupExpanded ? ' fullscreen-group--expanded' : ''), style: {
            transition: "opacity " + transitionMs + "ms ease",
        } },
        updatedChildren,
        state.currentFocusedImageIndex !== -1 && (React.createElement(React.Fragment, null,
            React.createElement("button", { className: "fullscreen-exit-btn", onClick: function () {
                    dispatch({
                        type: ImageGroup.actions.toggleCloseAnimate,
                    });
                }, "aria-label": "Close fullscreen view" },
                React.createElement(ExitIcon, null)),
            React.createElement("button", { ref: previousImageButton, className: "fullscreen-toggle toggle--left", onClick: function () {
                    dispatch({
                        type: ImageGroup.actions.toggleExpand,
                        payload: {
                            id: state.currentFocusedImageIndex - 1 !== -1
                                ? state.currentFocusedImageIndex - 1
                                : numberOfImageChildren - 1,
                        },
                    });
                }, tabIndex: state.isImageGroupExpanded ? 0 : -1, "aria-label": "Show previous photo" },
                React.createElement(Arrow, { direction: "left" })),
            React.createElement("button", { ref: nextImageButton, className: "fullscreen-toggle toggle--right", onClick: function () {
                    dispatch({
                        type: ImageGroup.actions.toggleExpand,
                        payload: {
                            id: state.currentFocusedImageIndex + 1 !== numberOfImageChildren
                                ? state.currentFocusedImageIndex + 1
                                : 0,
                        },
                    });
                }, tabIndex: state.isImageGroupExpanded ? 0 : -1, "aria-label": "Show next photo" },
                React.createElement(Arrow, { direction: "right" }))))));
}
ImageGroup.actions = {
    toggleExpand: 'TOGGLE_EXPAND',
    toggleExpandAnimate: 'TOGGLE_EXPAND_ANIMATE',
    toggleCloseAnimate: 'TOGGLE_CLOSE_ANIMATE',
};
export function Image(_a) {
    var src = _a.src, alt = _a.alt, style = _a.style, props = __rest(_a, ["src", "alt", "style"]);
    var onClick = props.onClick, isFocused = props.isFocused, shouldAnimate = props.shouldAnimate, isImageGroupExpanded = props.isImageGroupExpanded, transitionMs = props.transitionMs, rest = __rest(props, ["onClick", "isFocused", "shouldAnimate", "isImageGroupExpanded", "transitionMs"]);
    var scalingImage = React.useRef(null);
    var wasPreviouslyFocused = React.useRef(false);
    var initialRender = React.useRef(false);
    React.useEffect(function () {
        if (!initialRender.current) {
            initialRender.current = true;
            return;
        }
        var element = scalingImage.current;
        if (element) {
            if (isFocused) {
                if (shouldAnimate) {
                    calculatePosition('open')(element, transitionMs);
                }
                else {
                    calculatePosition('open')(element, 0);
                }
                wasPreviouslyFocused.current = true;
            }
            if (!isFocused && wasPreviouslyFocused.current) {
                if (shouldAnimate) {
                    calculatePosition('close')(element, transitionMs);
                }
                else {
                    calculatePosition('close')(element, 0);
                }
                wasPreviouslyFocused.current = false;
            }
        }
    }, [isFocused, shouldAnimate, transitionMs]);
    return (React.createElement("div", __assign({ className: "fullscreen-container" }, rest),
        React.createElement("button", { className: "fullscreen-btn", onClick: onClick, tabIndex: isFocused || !isImageGroupExpanded ? 0 : -1 },
            React.createElement("div", { className: "fullscreen-image" },
                React.createElement("img", { src: src, alt: alt, style: style })),
            React.createElement("div", { ref: scalingImage, className: "fullscreen-image" },
                React.createElement("img", { src: src, alt: alt, style: style })))));
}
Image.displayName = 'Image';
function mapPropsToChildren(children, fnToApplyToChild) {
    var numberOfImageChildren = 0;
    var recursiveMap = function (children) {
        return React.Children.map(children, function (child) {
            if (!React.isValidElement(child)) {
                return child;
            }
            if (child.type.displayName === Image.displayName) {
                child = fnToApplyToChild(child, numberOfImageChildren);
                numberOfImageChildren++;
                return child;
            }
            if (child.props.children) {
                child = React.cloneElement(child, {
                    children: recursiveMap(child.props.children),
                });
            }
            return child;
        });
    };
    var updatedChildren = recursiveMap(children);
    return {
        updatedChildren: updatedChildren,
        numberOfImageChildren: numberOfImageChildren,
    };
}
function calculatePosition(action) {
    return function calculate(el, transitionMs) {
        if (transitionMs === void 0) { transitionMs = 0; }
        if (action === 'open') {
            var innerWidth_1 = window.innerWidth, innerHeight_1 = window.innerHeight;
            var _a = el.getBoundingClientRect(), height = _a.height, width = _a.width, top_1 = _a.top, left = _a.left;
            var scaleBy = innerWidth_1 < innerHeight_1 ? 'width' : 'height';
            var scale = scaleBy === 'width' ? innerWidth_1 / width : innerHeight_1 / height;
            var scaledImageWidth = width * scale;
            var leftOfWhereScaledImageNeedsToBe = innerWidth_1 / 2 - scaledImageWidth / 2;
            var leftOfWhereScaledImageIs = left - (scaledImageWidth - width) / 2;
            var translateX = (leftOfWhereScaledImageNeedsToBe - leftOfWhereScaledImageIs) / scale;
            var translateY = 0;
            if (scaleBy === 'width') {
                var scaledImageHeight = height * scale;
                var centerOfScreen = innerHeight_1 / 2;
                var topOfWhereImageShouldBe = centerOfScreen - scaledImageHeight / 2;
                translateY = (topOfWhereImageShouldBe - top_1) / scale;
            }
            else {
                translateY = (top_1 / scale) * -1;
            }
            el.style.opacity = '1';
            el.style.transform = "scale(" + scale + ") translate3d(" + translateX + "px, " + translateY + "px, 0px)";
            el.style.transition = "transform " + transitionMs + "ms ease, opacity 0ms";
            el.style.transformOrigin = '50% 0';
            el.style.zIndex = '9';
            el.style.pointerEvents = 'initial';
            el.style.touchAction = 'initial';
            return;
        }
        if (action === 'close') {
            el.style.opacity = '0';
            el.style.transform = "scale(1) translate3d(0px, 0px, 0px)";
            el.style.transition = "transform " + transitionMs + "ms ease, opacity 0ms ease " + transitionMs + "ms, z-index 0ms ease " + transitionMs + "ms";
            el.style.transformOrigin = '50% 0';
            el.style.zIndex = '-1';
            el.style.pointerEvents = 'none';
            el.style.touchAction = 'none';
            return;
        }
    };
}
function isMobile() {
    if (typeof document !== "undefined") {
        return 'ontouchstart' in document.documentElement === true;
    }
    return false;
}
function Arrow(_a) {
    var _b = _a.direction, direction = _b === void 0 ? 'right' : _b;
    return direction === 'right' ? (React.createElement("svg", { width: "20", height: "34", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement("path", { d: "M18.3523845 18.5841646L4.77482194 32.343229c-.86369698.8756947-2.26403359.8756947-3.12731127 0-.86334756-.8749156-.86334756-2.2939446 0-3.1687894L13.6615574 16.9997698 1.6478601 4.82552501c-.86334757-.87526972-.86334757-2.29415709 0-3.16907271.86334755-.87526973 2.26361428-.87526973 3.12731126 0L18.3527339 15.4157292C18.7844077 15.8533995 19 16.4264076 19 16.999699c0 .5735747-.2160116 1.1470077-.6476155 1.5844656z", fillRule: "nonzero", stroke: "#000", fill: "#fff" }))) : (React.createElement("svg", { width: "20", height: "34", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement("path", { d: "M1.6476155 18.5841646L15.22517806 32.343229c.86369698.8756947 2.26403359.8756947 3.12731127 0 .86334756-.8749156.86334756-2.2939446 0-3.1687894L6.3384426 16.9997698 18.3521399 4.82552501c.86334757-.87526972.86334757-2.29415709 0-3.16907271-.86334755-.87526973-2.26361428-.87526973-3.12731126 0L1.6472661 15.4157292C1.2155923 15.8533995 1 16.4264076 1 16.999699c0 .5735747.2160116 1.1470077.6476155 1.5844656z", fillRule: "nonzero", stroke: "#000", fill: "#fff" })));
}
function ExitIcon() {
    return (React.createElement("svg", { width: "20", height: "20", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement("g", { fill: "#000", fillRule: "nonzero", stroke: "#000" },
            React.createElement("path", { d: "M18.6753571 2.08152486l-.6487597-.67476795c-.3578377-.37260221-.9393896-.37260221-1.2979286 0L9.98071429 8.33578453 3.21534416 1.30137569c-.35848052-.37254144-.93974026-.37254144-1.29792858 0l-.64875974.6746464c-.3581883.37272377-.3581883.97644752 0 1.34923205l8.055 8.37634806c.35818832.3729061.93898052.3729061 1.29757793 0l8.05412333-8.27102761c.359065-.37254144.359065-.97650829 0-1.34904973z" }),
            React.createElement("path", { d: "M18.6753571 17.91847514l-.6487597.67476795c-.3578377.37260221-.9393896.37260221-1.2979286 0l-6.74795451-6.92902762-6.76537013 7.03440884c-.35848052.37254144-.93974026.37254144-1.29792858 0l-.64875974-.6746464c-.3581883-.37272377-.3581883-.97644752 0-1.34923205l8.055-8.37634806c.35818832-.3729061.93898052-.3729061 1.29757793 0l8.05412333 8.27102761c.359065.37254144.359065.97650829 0 1.34904973z" }))));
}
//# sourceMappingURL=fullscreen.js.map