import React, { useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";

import ClassAPI from "api/ClassAPI";
import {
  ClassListRequest,
  ClassListResponse,
  SessionDetailResponse,
} from "api/types";
import ConfirmationDialog from "components/common/confirmation-dialog";
import FieldVariant from "constants/FieldVariant";

import AddClass, { ClassFormData } from "../add-classes/AddClass";
import { defaultClassData } from "../add-classes/AddClasses";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  dialogHeading: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  dialogPaper: {
    height: 750,
  },
  dialogSubheading: {
    marginTop: theme.spacing(3),
  },
}));

type ClassRequest = ClassListRequest & {
  session: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  session: SessionDetailResponse;
  onClassCreate: (classData: ClassListResponse) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AddClassDialog = ({ open, onClose, session, onClassCreate }: Props) => {
  const classes = useStyles();
  const [isConfirming, setIsConfirming] = useState(false);

  const [classData, setClassData] = useState<ClassRequest>({
    ...defaultClassData,
    session: session.id,
  });

  const classRequestToClassFormData = (
    classListData: ClassListRequest
  ): ClassFormData => ({ ...classListData, index: 0 });

  const handleClose = () => {
    setIsConfirming(true);
  };

  const onUpdateClass = (index: number, newClass: ClassListRequest) => {
    setClassData({ ...newClass, session: session.id });
  };

  const submitClass = async () => {
    try {
      const classResponse = await ClassAPI.postClass(classData);
      onClassCreate(classResponse);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        disableBackdropClick
        fullWidth
        maxWidth="md"
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle disableTypography>
          <Typography variant="h2">Add a class</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            className={classes.closeButton}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h3" className={classes.dialogHeading}>
            Class information
          </Typography>
          <Box marginY={4}>
            <AddClass
              classData={classRequestToClassFormData(classData)}
              classIndex={0}
              fieldVariant={FieldVariant.DEFAULT}
              onUpdateClass={onUpdateClass}
            />
          </Box>
          <Button variant="contained" color="primary" onClick={submitClass}>
            Next
          </Button>
        </DialogContent>
      </Dialog>
      <ConfirmationDialog
        cancelButtonLabel="No, go back"
        confirmButtonLabel="Yes"
        description="This information will not be saved."
        onCancel={() => {
          setIsConfirming(false);
        }}
        onConfirm={() => {
          setIsConfirming(false);
          onClose();
        }}
        open={isConfirming}
        title="Are you sure you want to go back to Sessions?"
      />
    </>
  );
};

export default AddClassDialog;
