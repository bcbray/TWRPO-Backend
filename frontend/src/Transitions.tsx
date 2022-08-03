import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import { TransitionStatus } from 'react-transition-group/Transition';
import useMergedRefs from '@restart/hooks/useMergedRefs';

import styles from './Transitions.module.css';
import { classes } from './utils';

const transitionStatusStyle: Partial<Record<TransitionStatus, string>> = {
  entering: styles.show,
  entered: styles.show,
  //exiting: "exiting",
  //exited: "exited",
  //unmounted: "unmounted"
};

export const Slide: React.FC<Omit<CSSTransitionProps, 'children'> & { children: React.ReactElement }> = ({ children, ...props }) => {
  const nodeRef = React.useRef(null);
  const { ref } = children as any;
  const mergedRef = useMergedRefs(nodeRef, ref);
  return (
    <CSSTransition
      nodeRef={nodeRef}
      {...props}
      timeout={300}
      onEnter={() => {
        // trigger a reflow
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
        nodeRef.current && (nodeRef.current as any).offsetWidth;
      }}
    >
      {(status: TransitionStatus) =>
        React.cloneElement(children, {
          ref: mergedRef,
          className: classes(styles.slide, transitionStatusStyle[status], children.props.className)
        })
      }
    </CSSTransition>
  );
};

export const Fade: React.FC<Omit<CSSTransitionProps, 'children'> & { children: React.ReactElement }> = ({ children, ...props }) => {
  const nodeRef = React.useRef(null);
  const { ref } = children as any;
  const mergedRef = useMergedRefs(nodeRef, ref);
  return (
    <CSSTransition
      nodeRef={nodeRef}
      {...props}
      timeout={500}
      onEnter={() => {
        // trigger a reflow
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
        nodeRef.current && (nodeRef.current as any).offsetWidth;
      }}
    >
      {(status: TransitionStatus) =>
        React.cloneElement(children, {
          ref: mergedRef,
          className: classes(styles.fade, transitionStatusStyle[status], children.props.className)
        })
      }
    </CSSTransition>
  );
};
