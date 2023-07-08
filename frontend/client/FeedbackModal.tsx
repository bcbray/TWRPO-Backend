import React from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useLocation } from 'react-router';
import { Button } from '@restart/ui';
import { toast } from 'react-toastify';

import styles from './FeedbackModal.module.css';
import Modal from './Modal';
import { classes } from './utils';
import Spinner from './Spinner';
import { useAuthentication } from './auth';
import ProfilePhoto from './ProfilePhoto';
import LoginButton from './LoginButton';

import OutboundLink from './OutboundLink';

interface Props {
  show: boolean;
  onHide: (sent: boolean) => void;
}

const schema = Yup.object({
  suggestion: Yup.string().required('cannot be empty'),
  email: Yup.string().email('must be valid email'),
  discord: Yup.string().matches(/^(?!(discordtag|here|everyone)(?:#|$))((?!@|!|#|:|```|discord)[\s\S]){2,32}(#\d{4})?$/, { message: 'must be valid Discord username' }),
});

type FormData = Yup.InferType<typeof schema>;

const FeedbackModal: React.FC<Props> = ({ show, onHide }) => {
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [hasSubmissionError, setHasSubmissionError] = React.useState(false);
  const location = useLocation();
  const { user, logout } = useAuthentication();

  const initialFields: FormData = { suggestion: '', email: undefined, discord: undefined };

  const showSentToast = React.useCallback(() => (
    toast.info('Feedback sent. Thank you!')
  ), []);

  const submitForm = React.useCallback(async (values: FormData) => {
    setHasSubmissionError(false);
    await new Promise(r => setTimeout(r, 2000));
    try {
      const reply = await axios.post('/api/v2/submit-feedback', {
        page: `${location.pathname}${location.search}${location.hash}`,
        ...values,
      })
      if (reply.data.success !== true) {
        throw Error('Invalid response')
      }
      showSentToast();
      setHasSubmitted(true);
      onHide(true);
    } catch (error) {
      setHasSubmissionError(true);
    }
  }, [location.hash, location.pathname, location.search, showSentToast, onHide]);

  return (
    <Formik
      initialValues={initialFields}
      validationSchema={schema}
      onSubmit={submitForm}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        handleReset,
        isSubmitting,
      }) =>
        <Modal
          show={show}
          onHide={() => onHide(false)}
          onExited={() => {
            handleReset();
            setHasSubmitted(false);
            setHasSubmissionError(false);
          }}
          backdrop={values.suggestion || values.discord || values.email ? 'static' : true}
          dismissOnEscape={!values.suggestion && !values.discord && !values.email}
        >
          <form
            onSubmit={handleSubmit}
          >
            <div className={styles.header}>
              Suggestion
            </div>
            <div className={styles.body}>
              <div>
                <div className={styles.description}>
                  <small id='suggestionHelpBlock' className={styles.muted}>
                    Keeping track of all the meta is hard. If you notice something missing or out of place, please include streamer, character, and faction names as appropriate. Throw in your contact info if you’re open to questions about this feedback. You can also give feedback on the <OutboundLink target='_blank' rel='noreferrer' href='https://discord.gg/fSuKefMGQp'>Twitch WildRP Only Discord</OutboundLink>.
                  </small>
                </div>
                <div className={styles.labelContainer}>
                  <label htmlFor='FeedbackForm.Suggestion'>
                    Suggestion
                  </label>
                  {touched.suggestion && errors.suggestion && (
                    <span className={styles.error}>
                        {errors.suggestion}
                    </span>
                  )}
                </div>
                <textarea
                  name='suggestion'
                  rows={5}
                  aria-describedby='suggestionHelpBlock'
                  id='FeedbackForm.Suggestion'
                  className={classes(touched.suggestion && errors.suggestion && styles.invalid)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.suggestion}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <div className={styles.labelContainer}>
                  <label>
                    Twitch <span className={styles.muted}>(optional)</span>
                  </label>
                </div>
                {user ? (
                  <div className={styles.twitchUser}>
                    <ProfilePhoto
                      className={styles.pfp}
                      channelInfo={{
                        id: user.twitchId,
                        login: user.twitchLogin,
                        displayName: user.displayName,
                        profilePictureUrl: user.profilePhotoUrl,
                      }}
                    />
                    {user.displayName}
                    <Button
                      as='a'
                      className={classes(
                        styles.logOut,
                        isSubmitting && styles.disabled
                      )}
                      onClick={logout}
                      disabled={isSubmitting}
                    >
                      Log out
                    </Button>
                  </div>
                ) : (
                  <LoginButton
                    disabled={isSubmitting}
                  />
                )}
              </div>
              <div>
                <div className={styles.labelContainer}>
                  <label htmlFor='FeedbackForm.Email'>
                    Email address <span className={styles.muted}>(optional)</span>
                  </label>
                  {touched.email && errors.email && (
                    <span className={styles.error}>
                        {errors.email}
                    </span>
                  )}
                </div>
                <Field
                  className={classes(touched.email && errors.email && touched.email && styles.invalid)}
                  name='email'
                  type='text'
                  placeholder='name@example.com'
                  id='FeedbackForm.Email'
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <div className={styles.labelContainer}>
                  <label htmlFor='FeedbackForm.Discord'>
                  Discord <span className={styles.muted}>(optional)</span>
                  </label>
                  {touched.discord && errors.discord && (
                    <span className={styles.error}>
                        {errors.discord}
                    </span>
                  )}
                </div>
                <Field
                  className={classes(touched.discord && errors.discord && styles.invalid)}
                  name='discord'
                  type='text'
                  placeholder='You or You#1234'
                  id='FeedbackForm.Discord'
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className={styles.footer}>
              {hasSubmissionError &&
                <div className={styles.alert}>
                  Unable to submit feedback. Please try again later. You can also send feedback on <OutboundLink target='_blank' rel='noreferrer' href='https://discord.gg/fSuKefMGQp'>Discord</OutboundLink> in the meantime.
                </div>
              }
              <Button
                className='button secondary'
                onClick={() => onHide(false)}
                disabled={isSubmitting || hasSubmitted}
              >
                Cancel
              </Button>
              <Button
                className='button primary'
                type='submit'
                disabled={isSubmitting || hasSubmitted}
              >
                {isSubmitting || hasSubmitted
                  ? <>
                    <Spinner size='sm' className={styles.submitSpinner} as='span' />
                    Sending…
                  </>
                  : 'Send Suggestion'
                }
              </Button>
            </div>
          </form>
        </Modal>
      }
    </Formik>
  );
};

export default FeedbackModal;
