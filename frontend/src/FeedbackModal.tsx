import React from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useLocation } from 'react-router';

interface Props {
  show: boolean;
  onHide: (sent: boolean) => void;
}

const schema = Yup.object({
  suggestion: Yup.string().required(),
  email: Yup.string().email(),
  discord: Yup.string().matches(/^(?!(discordtag|here|everyone)#)(((?!@|!|:|```|discord)[\s\S]){2,32}#)\d{4}$/),
});

type FormData = Yup.InferType<typeof schema>;

const FeedbackModal: React.FC<Props> = ({ show, onHide }) => {
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [hasSubmissionError, setHasSubmissionError] = React.useState(false);
  const location = useLocation();

  const initialFields: FormData = { suggestion: '', email: undefined, discord: undefined };

  const submitForm = async (values: FormData) => {
    setHasSubmissionError(false);
    try {
      const reply = await axios.post('/api/v2/submit-feedback', {
        page: `${location.pathname}${location.search}${location.hash}`,
        ...values,
      })
      if (reply.data.success !== true) {
        throw Error('Invalid response')
      }
      setHasSubmitted(true);
      onHide(true);
    } catch (error) {
      setHasSubmissionError(true);
    }
  }

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
        isSubmitting
      }) =>
        <Modal
          show={show}
          onHide={() => onHide(false)}
          onExited={() => {
            handleReset();
            setHasSubmitted(false);
            setHasSubmissionError(false);
          }}
          backdrop="static"
        >
          <Form noValidate onSubmit={handleSubmit}>
            <Modal.Header>
              <Modal.Title>Suggestion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label className="visually-hidden">Suggestion</Form.Label>
                <div className="mb-2">
                  <Form.Text id="suggestionHelpBlock" muted className="m-0">
                    Please make sure to include streamer and character name with suggestions. Include contact info if you’re open to questions about this feedback. You can also give feedback on the <a target='_blank' rel='noreferrer' href='https://discord.gg/fSuKefMGQp'>Twitch WildRP Only Discord</a>.
                  </Form.Text>
                </div>
                <Form.Control
                  name="suggestion"
                  as="textarea"
                  rows={5}
                  value={values.suggestion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting || hasSubmitted}
                  isInvalid={!!errors.suggestion}
                  aria-describedby="suggestionHelpBlock"
                  //autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Email address <span className="text-muted">(optional)</span></Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="name@example.com"
                  disabled={isSubmitting || hasSubmitted}
                  isInvalid={!!errors.email}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Discord <span className="text-muted">(optional)</span></Form.Label>
                <Form.Control
                  name="discord"
                  type="text"
                  value={values.discord}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="You#1234"
                  disabled={isSubmitting || hasSubmitted}
                  isInvalid={!!errors.discord}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              {hasSubmissionError &&
                <Alert variant="danger" style={{ width: '100%' }}>
                  Unable to submit feedback. Please try again later. You can also send feedback on <a target='_blank' rel='noreferrer' href='https://discord.gg/fSuKefMGQp'>Discord</a> in the meantime.
                </Alert>
              }
              <Button
                variant="secondary"
                onClick={() => onHide(false)}
                disabled={isSubmitting || hasSubmitted}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting || hasSubmitted}
              >
                {isSubmitting || hasSubmitted
                  ? <>
                    <Spinner size="sm" animation="border" className="me-2" as="span"/>
                    Sending…
                  </>
                  : 'Send Suggestion'
                }
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      }
    </Formik>
  );
};

export default FeedbackModal;
