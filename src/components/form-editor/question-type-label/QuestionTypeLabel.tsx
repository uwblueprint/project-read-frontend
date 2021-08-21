import React, { ReactNode } from "react";

import { Box, Typography } from "@material-ui/core";
import {
  CheckBox,
  ExpandMore,
  LockOutlined,
  ShortText,
} from "@material-ui/icons";

import QuestionType from "constants/QuestionType";

import useStyles from "./styles";

type QuestionTypeDisplay = {
  icon: ReactNode;
  label: string;
};

const getQuestionTypeDisplay = (
  type: string,
  className: string
): QuestionTypeDisplay => {
  switch (type) {
    case QuestionType.IDENTIFIER:
      return {
        icon: <LockOutlined className={className} />,
        label: "Identifier",
      };
    case QuestionType.SELECT:
      return {
        icon: <ExpandMore className={className} />,
        label: "Dropdown",
      };
    case QuestionType.MULTIPLE_SELECT:
      return {
        icon: <CheckBox className={className} />,
        label: "Checkboxes",
      };
    case QuestionType.TEXT:
      return {
        icon: <ShortText className={className} />,
        label: "Short answer",
      };
    default:
      return {
        icon: null,
        label: "",
      };
  }
};

type Props = {
  questionType: string;
};

const QuestionTypeLabel = ({ questionType }: Props) => {
  const classes = useStyles();

  return (
    <Box display="flex" alignItems="center">
      {getQuestionTypeDisplay(questionType, classes.labelIcon).icon}
      <Typography
        className={classes.label}
        color="textSecondary"
        variant="body2"
      >
        {getQuestionTypeDisplay(questionType, classes.labelIcon).label}
      </Typography>
    </Box>
  );
};

export default QuestionTypeLabel;
