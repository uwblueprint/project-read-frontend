import React, { ReactNode } from "react";

import { Box, IconButton } from "@material-ui/core";
import { OpenInNew } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";

import FormRow from "components/common/form-row";
import QuestionType from "constants/QuestionType";

const baseId = "enrolment-select";

const useStyles = makeStyles(() => ({
  linkButton: {
    height: 40,
    width: 40,
    "& svg": {
      height: 20,
      width: 20,
    },
  },
}));

type Props = {
  children: ReactNode;
  id: string;
  label: string;
  link?: string;
};

const defaultProps = {
  link: "",
};

const EnrolmentSelectFormRow = ({ children, id, label, link }: Props) => {
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="row">
      <Box width={280}>
        <FormRow
          dense
          id={`${baseId}-${id}`}
          label={label}
          questionType={QuestionType.MULTIPLE_CHOICE}
        >
          {children}
        </FormRow>
      </Box>
      {link && (
        <Box marginLeft={1} marginY={0.25}>
          <Link to={link} target="blank">
            <IconButton className={classes.linkButton}>
              <OpenInNew color="primary" />
            </IconButton>
          </Link>
        </Box>
      )}
    </Box>
  );
};

EnrolmentSelectFormRow.defaultProps = defaultProps;

export default EnrolmentSelectFormRow;
