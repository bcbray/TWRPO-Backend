import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import { TransitionStatus } from 'react-transition-group/Transition';
import useMergedRefs from '@restart/hooks/useMergedRefs';

import styles from './Transitions.module.css';
import { classes, createChainedFunction } from './utils';

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

const collapseStatusStyle: Partial<Record<TransitionStatus, string>> = {
  exited:  styles.collapse,
  exiting: styles.collapsing,
  entering: styles.collapsing,
  entered: classes(styles.collapse, styles.show),
};

export const Collapse: React.FC<Omit<CSSTransitionProps, 'children'> & { children: React.ReactElement }> = ({ children, onEnter, onEntering, onEntered, onExit, onExiting, ...props }) => {
  const nodeRef = React.useRef<HTMLElement>(null);
  const { ref } = children as any;
  const mergedRef = useMergedRefs(nodeRef, ref);

  const handleEnter = React.useMemo(() => {
    return createChainedFunction(() => {
      if (!nodeRef.current) return;
      nodeRef.current.style.height = '0';
    }, onEnter);
  }, [onEnter]);

  const handleEntering = React.useMemo(() => {
    return createChainedFunction(() => {
      if (!nodeRef.current) return;
      nodeRef.current.style.height = `${nodeRef.current.scrollHeight}px`;
    }, onEntering);
  }, [onEntering]);

  const handleEntered = React.useMemo(() => {
    return createChainedFunction(() => {
      if (!nodeRef.current) return;
      nodeRef.current.style.height = 'auto';
    }, onEntered);
  }, [onEntered]);

  const handleExit = React.useMemo(() => {
    return createChainedFunction(() => {
      if (!nodeRef.current) return;
      nodeRef.current.style.height = `${nodeRef.current.scrollHeight}px`;
    }, onExit);
  }, [onExit]);

  const handleExiting = React.useMemo(() => {
    return createChainedFunction(() => {
      if (!nodeRef.current) return;
      nodeRef.current.style.height = '0';
    }, onExiting);
  }, [onExiting]);

  const transitionEnd = React.useCallback((done: () => void) => {
    if (!nodeRef.current) return done();
    nodeRef.current.addEventListener('transitionend', done, false);
  }, []);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      {...props}
      addEndListener={transitionEnd}
      timeout={350}
      onEnter={handleEnter}
      onEntering={handleEntering}
      onEntered={handleEntered}
      onExit={handleExit}
      onExiting={handleExiting}
    >
      {(status: TransitionStatus) =>
        React.cloneElement(children, {
          ref: mergedRef,
          className: classes(collapseStatusStyle[status], children.props.className)
        })
      }
    </CSSTransition>
  );
};
