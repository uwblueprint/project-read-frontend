import React, { ReactNode } from "react";

import { Box, InputLabel, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import FieldVariant from "constants/FieldVariant";
import QuestionType from "constants/QuestionType";

const useStyles = makeStyles<Theme, Pick<Props, "dense">>(() => ({
  label: {
    fontSize: ({ dense }) => (dense ? 14 : 16),
  },
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
  const classes = useStyles({ dense });

  const inputLabelProps =
    questionType === QuestionType.MULTIPLE_CHOICE ? { id } : { htmlFor: id };

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      marginBottom={dense ? "4px" : 2}
    >
      {/* hidden input to disable autocomplete: https://gist.github.com/niksumeiko/360164708c3b326bd1c8#gistcomment-3716208 */}
      {questionType === QuestionType.TEXT && (
        <Box display="none" aria-hidden="true">
          <input aria-hidden="true" tabIndex={-1} />
        </Box>
      )}
      <Box
        paddingRight={2}
        width={dense ? 128 : 144}
        hidden={variant === FieldVariant.COMPACT}
      >
        {
          // eslint-disable-next-line react/jsx-props-no-spreading
          <InputLabel className={classes.label} {...inputLabelProps}>
            {label}
          </InputLabel>
        }
      </Box>
      <Box flexGrow={1}>{children}</Box>
    </Box>
  );
};

FormRow.defaultProps = defaultProps;

export default FormRow;
