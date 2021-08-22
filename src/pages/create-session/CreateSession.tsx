import React, { useContext, useEffect, useState } from "react";

import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import { NavigateBefore } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

import { SessionRequest } from "api/types";
import FormEditor from "components/form-editor";
import AddClasses from "components/sessions/add-classes";
import { defaultClassData } from "components/sessions/add-classes/AddClasses";
import SessionConfig from "components/sessions/session-config";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";

enum CreateSessionStepLabel {
  ADD_CLASSES = "Add classes",
  CONFIGURE_FORM = "Configure form",
  CONFIGURE_SESSION = "Create a session",
}

const steps = [
  CreateSessionStepLabel.CONFIGURE_SESSION,
  CreateSessionStepLabel.CONFIGURE_FORM,
  CreateSessionStepLabel.ADD_CLASSES,
];

const CreateSession = () => {
  const {
    parentDynamicFields,
    childDynamicFields,
    guestDynamicFields,
    sessionDynamicFields,
  } = useContext(DynamicFieldsContext).dynamicFields;
  const history = useHistory();
  const [session, setSession] = useState<SessionRequest>({
    name: "",
    start_date: null,
    fields: [],
    classes: [defaultClassData],
  });

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = steps[activeStepIndex];

  useEffect(() => {
    setSession({
      ...session,
      fields: [
        ...parentDynamicFields.map((field) => field.id),
        ...childDynamicFields.map((field) => field.id),
        ...guestDynamicFields.map((field) => field.id),
        ...sessionDynamicFields.map((field) => field.id),
      ],
    });
  }, [
    parentDynamicFields,
    childDynamicFields,
    guestDynamicFields,
    sessionDynamicFields,
  ]);

  const goToSessions = () => {
    history.push("/sessions");
  };

  const handleNext = () => {
    setActiveStepIndex((prevActiveStepIndex) => prevActiveStepIndex + 1);
  };

  const handleBack = () => {
    setActiveStepIndex((prevActiveStepIndex) => prevActiveStepIndex - 1);
  };

  const handleSubmit = () => {
    // TODO: submit to the create session API
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const payload = {
      name: session.name,
      start_date: session.start_date,
    };
    goToSessions();
  };

  const stepTitles = {
    [CreateSessionStepLabel.ADD_CLASSES]: "Add classes",
    [CreateSessionStepLabel.CONFIGURE_FORM]: `Create the ${session.name} client registration form`,
    [CreateSessionStepLabel.CONFIGURE_SESSION]: "Create a new session",
  };

  const stepContent = () => {
    switch (activeStep) {
      case CreateSessionStepLabel.CONFIGURE_SESSION:
        return (
          <SessionConfig
            sessionName={session.name}
            onChangeSessionName={(name) => setSession({ ...session, name })}
            startDate={session.start_date}
            onChangeStartDate={(start_date) =>
              setSession({ ...session, start_date })
            }
          />
        );
      case CreateSessionStepLabel.CONFIGURE_FORM:
        return (
          <FormEditor
            isReadOnly
            enabledFieldIds={session.fields}
            onChangeEnabledFieldIds={(fields) =>
              setSession({ ...session, fields })
            }
          />
        );
      // fall through
      case CreateSessionStepLabel.ADD_CLASSES:
        return (
          <AddClasses
            classList={session.classes}
            onChangeClasses={(classes) => setSession({ ...session, classes })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Button onClick={() => goToSessions()}>
        <NavigateBefore />
        Go back
      </Button>
      <Box marginY={2}>
        <Typography variant="h1">{stepTitles[activeStep]}</Typography>
        <Box marginY={3}>
          <Stepper alternativeLabel activeStep={activeStepIndex}>
            {steps.map((stepLabel) => (
              <Step key={stepLabel}>
                <StepLabel>{stepLabel}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <div>
          {stepContent()}
          <Box display="flex" flexDirection="row" marginY={4}>
            <Box marginRight={2}>
              <Button disabled={activeStepIndex === 0} onClick={handleBack}>
                Back
              </Button>
            </Box>
            <Box>
              {activeStepIndex === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Finish
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </div>
      </Box>
    </div>
  );
};

export default CreateSession;
