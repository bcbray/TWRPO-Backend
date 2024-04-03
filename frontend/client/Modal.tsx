import React from 'react';
import { Modal as BaseModal, ModalProps as BaseModalProps } from '@restart/ui';
import { ModalHandle } from '@restart/ui/Modal';
import { RenderModalDialogProps, RenderModalBackdropProps } from '@restart/ui/Modal';
import { useCallbackRef } from '@restart/hooks';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import { TransitionStatus } from 'react-transition-group/Transition';

import styles from './Modal.module.css';
import { classes } from './utils';

interface ModalProps
  extends Omit<BaseModalProps,'children'>
{
  centered: boolean;
  dismissOnEscape: boolean;
  dialogClassName?: string;
  contentClassName?: string;
}

const transitionStatusStyle: Partial<Record<TransitionStatus, string>> = {
  entering: styles.show,
  entered: styles.show,
};

const Slide: React.FC<Omit<CSSTransitionProps, 'children'> & { children: React.ReactElement }> = ({ children, ...props }) => {
  const nodeRef = React.useRef(null);
  const { ref } = children as any;
  const mergedRef = useMergedRefs(nodeRef, ref);
  return <CSSTransition nodeRef={nodeRef} {...props} timeout={300}>
    {(status: TransitionStatus) =>
      React.cloneElement(children, {
        ref: mergedRef,
        className: classes(transitionStatusStyle[status], children.props.className)
      })
    }
  </CSSTransition>
};

const Fade: React.FC<Omit<CSSTransitionProps, 'children'> & { children: React.ReactElement }> = ({ children, ...props }) => {
  const nodeRef = React.useRef(null);
  const { ref } = children as any;
  const mergedRef = useMergedRefs(nodeRef, ref);
  return <CSSTransition nodeRef={nodeRef} {...props} timeout={300}>
    {(status: TransitionStatus) =>
      React.cloneElement(children, {
        ref: mergedRef,
        className: classes(transitionStatusStyle[status], children.props.className)
      })
    }
  </CSSTransition>
};

const Modal = React.forwardRef<ModalHandle, ModalProps>((
  {
    className,
    children,
    centered = false,
    dismissOnEscape = true,

    // BaseModelProps
    show,
    animation,
    backdrop,
    keyboard,
    onEscapeKeyDown,
    onShow,
    onHide,
    container,
    autoFocus,
    enforceFocus,
    restoreFocus,
    restoreFocusOptions,
    onEntered,
    onExit,
    onExiting,
    onEnter,
    onEntering,
    onExited,
    backdropClassName,
    dialogClassName,
    contentClassName,
    manager: propsManager,
    transition = Slide,
    backdropTransition = Fade,
    ...props
  },
  ref
) => {
  const [isPreventingDismiss, setIsPreventingDismiss] = React.useState(false);
  const [modal, setModalRef] = useCallbackRef<ModalHandle>();
  const mergedRef = useMergedRefs<ModalHandle | null>(ref, setModalRef);

  const handlePulse = () => {
    if (!modal || !modal.dialog) {
      return;
    }
    setIsPreventingDismiss(true);
    setTimeout(() => setIsPreventingDismiss(false), 820);
  }

  const handleEscapeKeyDown = (e: KeyboardEvent) => {
    if (!dismissOnEscape) {
      handlePulse();
      e.preventDefault();
    }
  };

  const handleBackdropClick = (e: React.SyntheticEvent) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    if (backdrop === 'static') {
      handlePulse();
      e.preventDefault();
    } else {
      onHide?.();
    }
  };

  const renderBackdrop = (backdropProps: RenderModalBackdropProps) => (
    <div
      className={styles.backdrop}
      {...backdropProps}
    >
    </div>
  );
  const renderDialog = (dialogProps: RenderModalDialogProps) => (
    <div
      {...dialogProps}
      className={classes(className, styles.modal, isPreventingDismiss && styles.shake, centered && styles.centered)}
      onClick={handleBackdropClick}
      {...props}
    >
      <div className={classes(dialogClassName, styles.dialog)}>
        <div className={classes(contentClassName, styles.content)}>
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <BaseModal
      show={show}
      ref={mergedRef}
      backdrop={backdrop}
      container={container}
      keyboard // Always set true - see handleEscapeKeyDown
      onEscapeKeyDown={handleEscapeKeyDown}
      onBackdropClick={handleBackdropClick}
      autoFocus={autoFocus}
      enforceFocus={enforceFocus}
      restoreFocus={restoreFocus}
      restoreFocusOptions={restoreFocusOptions}
      onShow={onShow}
      onHide={onHide}
      onEnter={onEnter}
      onEntering={onEntering}
      onEntered={onEntered}
      onExit={onExit}
      onExiting={onExiting}
      onExited={onExited}
      manager={propsManager}
      renderBackdrop={renderBackdrop}
      renderDialog={renderDialog}
      transition={transition}
      backdropTransition={backdropTransition}
    />
  );
});

export default Modal;
