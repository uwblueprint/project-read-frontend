import React, { ReactNode } from "react";

import { Box, Typography } from "@material-ui/core";
import { CheckBox, ExpandMore, ShortText } from "@material-ui/icons";

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
    <Box display="flex">
      {getQuestionTypeDisplay(questionType, classes.labelIcon).icon}
      <Typography
        color="textSecondary"
        variant="body2"
        style={{
          fontSize: 12,
          alignSelf: "center",
          marginRight: 8,
        }}
      >
        {getQuestionTypeDisplay(questionType, classes.labelIcon).label}
      </Typography>
    </Box>
  );
};

export default QuestionTypeLabel;
