import React, { ReactNode } from "react";

import { Box, InputLabel, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import FieldVariant from "constants/FieldVariant";
import QuestionType from "constants/QuestionType";

const denseStyles = {
  formRow: {
    marginBottom: 4,
  },
  labelContainer: {
    width: 128,
  },
};

const stackedStyles = {
  formRow: {
    alignItems: "",
    paddingTop: 8,
    paddingBottom: 8,
    "flex-direction": "column",
  },
  labelContainer: {
    paddingBottom: 12,
    width: "100%",
    minWidth: 144,
  },
};

const useStyles = makeStyles<
  Theme,
  Pick<Props, "dense" | "multiple" | "variant">
>(() => ({
  formRow: ({ dense, multiple, variant }) => ({
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    marginBottom: multiple ? 16 : 0,
    ...(dense && denseStyles.formRow),
    ...(variant === FieldVariant.STACKED && stackedStyles.formRow),
  }),
  label: {
    fontSize: ({ dense }) => (dense ? 14 : 16),
  },
  labelContainer: ({ dense, variant }) => ({
    flexShrink: 0,
    paddingRight: 16,
    width: 144,
    ...(dense && denseStyles.labelContainer),
    ...(variant === FieldVariant.STACKED && stackedStyles.labelContainer),
  }),
}));

type Props = {
  children: ReactNode;
  dense?: boolean;
  id: string;
  label: string;
  multiple?: boolean;
  questionType: string;
  variant?: FieldVariant;
};

const FormRow = ({
  children,
  dense = false,
  id,
  label,
  multiple = true,
  questionType,
  variant = FieldVariant.DEFAULT,
}: Props) => {
  const classes = useStyles({ dense, multiple, variant });

  const inputLabelProps =
    questionType === QuestionType.SELECT ? { id } : { htmlFor: id };

  return (
    <div className={classes.formRow}>
      {/* hidden input to disable autocomplete: https://gist.github.com/niksumeiko/360164708c3b326bd1c8#gistcomment-3716208 */}
      {questionType === QuestionType.TEXT && (
        <Box display="none" aria-hidden="true">
          <input aria-hidden="true" tabIndex={-1} />
        </Box>
      )}
      <div
        className={classes.labelContainer}
        hidden={variant === FieldVariant.COMPACT}
      >
        {
          // eslint-disable-next-line react/jsx-props-no-spreading
          <InputLabel className={classes.label} {...inputLabelProps}>
            {label}
          </InputLabel>
        }
      </div>
      <Box flexGrow={1} overflow="hidden" textOverflow="clip">
        {children}
      </Box>
    </div>
  );
};

export default FormRow;
