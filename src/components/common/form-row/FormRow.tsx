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
    minWidth: 128,
  },
};

const stackedStyles = {
  formRow: {
    alignItems: "",
    "flex-direction": "column",
  },
  labelContainer: {
    paddingBottom: 12,
  },
};

const useStyles = makeStyles<Theme, Pick<Props, "dense" | "variant">>(() => ({
  formRow: ({ dense, variant }) => ({
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    marginBottom: 16,
    ...(dense && denseStyles.formRow),
    ...(variant === FieldVariant.STACKED && stackedStyles.formRow),
  }),
  label: {
    fontSize: ({ dense }) => (dense ? 14 : 16),
  },
  labelContainer: ({ dense, variant }) => ({
    minWidth: 144,
    paddingRight: 2,
    ...(dense && denseStyles.labelContainer),
    ...(variant === FieldVariant.STACKED && stackedStyles.labelContainer),
  }),
}));

type Props = {
  children: ReactNode;
  dense?: boolean;
  id: string;
  label: string;
  questionType: string;
  variant?: FieldVariant;
};

const defaultProps = {
  dense: false,
  variant: FieldVariant.DEFAULT,
};

const FormRow = ({
  children,
  dense,
  id,
  label,
  questionType,
  variant,
}: Props) => {
  const classes = useStyles({ dense, variant });

  const inputLabelProps =
    questionType === QuestionType.MULTIPLE_CHOICE ? { id } : { htmlFor: id };

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
      <Box flexGrow={1}>{children}</Box>
    </div>
  );
};

FormRow.defaultProps = defaultProps;

export default FormRow;
