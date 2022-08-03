import React from 'react';
import ReactDOM from 'react-dom';
import { Overlay } from '@restart/ui';
import { OverlayInjectedProps } from '@restart/ui/Overlay';
import { Placement } from '@restart/ui/usePopper';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import useTimeout from '@restart/hooks/useTimeout';

import { Fade } from './Transitions';

export type OverlayDelay = number | { show: number; hide: number };

export type OverlayChildren =
  | React.ReactElement<OverlayInjectedProps>
  | ((injected: OverlayInjectedProps) => React.ReactNode);

export type OverlayTriggerRenderProps = OverlayInjectedProps & {
  ref: React.Ref<any>;
};

export interface OverlayTriggerProps {
  children:
    | React.ReactElement
    | ((props: OverlayTriggerRenderProps) => React.ReactNode);
  placement: Placement;
  delay?: OverlayDelay;
  overlay: OverlayChildren
}

function safeFindDOMNode(
  componentOrElement: React.ComponentClass | Element | null | undefined,
) {
  if (componentOrElement && 'setState' in componentOrElement) {
    return ReactDOM.findDOMNode(componentOrElement);
  }
  return (componentOrElement ?? null) as Element | Text | null;
}

function normalizeDelay(delay?: OverlayDelay) {
  return delay && typeof delay === 'object'
    ? delay
    : {
        show: delay,
        hide: delay,
      };
}

const OverlayTrigger: React.FC<OverlayTriggerProps> = ({
  children,
  placement,
  delay: propsDelay,
  overlay,
  ...props
}) => {
  const triggerNodeRef = React.useRef(null);
  const mergedRef = useMergedRefs<unknown>(
    triggerNodeRef,
    (children as any).ref,
  );
  const timeout = useTimeout();
  const hoverStateRef = React.useRef<string>('');

  const [show, setShow] = React.useState(false);

  const delay = normalizeDelay(propsDelay);

  const attachRef = (r: React.ComponentClass | Element | null | undefined) => {
    mergedRef(safeFindDOMNode(r));
  };

  const handleShow = React.useCallback(() => {
    timeout.clear();
    hoverStateRef.current = 'show';

    if (!delay.show) {
      setShow(true);
      return;
    }

    timeout.set(() => {
      if (hoverStateRef.current === 'show') setShow(true);
    }, delay.show);
  }, [delay.show, setShow, timeout]);

  const handleHide = React.useCallback(() => {
    timeout.clear();
    hoverStateRef.current = 'hide';

    if (!delay.hide) {
      setShow(false);
      return;
    }

    timeout.set(() => {
      if (hoverStateRef.current === 'hide') setShow(false);
    }, delay.hide);
  }, [delay.hide, setShow, timeout]);

  const triggerProps: any = {
    ref: attachRef,
  };

  triggerProps.onMouseOver = handleShow;
  triggerProps.onMouseOut = handleHide;

  return (
    <>
      {typeof children === 'function'
        ? children(triggerProps)
        : React.cloneElement(children, triggerProps)}
      <Overlay
        {...props}
        show={show}
        placement={placement}
        target={triggerNodeRef.current}
        transition={Fade as any}
      >
        {(overlayInjectedProps, { arrowProps }) => {
          const props = {
            onMouseOver: handleShow,
            onMouseOut: handleHide,
            arrowProps,
            ...overlayInjectedProps
          }
          return typeof overlay === 'function'
            ? overlay(props)
            : React.cloneElement(overlay, props)
        }}
      </Overlay>
    </>
  );
};

export default OverlayTrigger;
