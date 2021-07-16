import React, { ReactNode } from "react";

import { Box, InputLabel } from "@material-ui/core";

import FieldVariant from "constants/FieldVariant";
import QuestionType from "constants/QuestionType";

type Props = {
  children: ReactNode;
  id: string;
  label: string;
  questionType: string;
  variant?: FieldVariant;
};

const defaultProps = {
  variant: FieldVariant.DEFAULT,
};

const FormRow = ({ children, id, label, questionType, variant }: Props) => {
  const inputLabelProps =
    questionType === QuestionType.MULTIPLE_CHOICE ? { id } : { htmlFor: id };

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      marginBottom={2}
      width={variant === FieldVariant.COMPACT ? 328 : 488}
    >
      {/* hidden input to disable autocomplete: https://gist.github.com/niksumeiko/360164708c3b326bd1c8#gistcomment-3716208 */}
      {questionType === QuestionType.TEXT && (
        <Box display="none" aria-hidden="true">
          <input aria-hidden="true" tabIndex={-1} />
        </Box>
      )}
      <Box
        paddingRight={2}
        minWidth={144}
        hidden={variant === FieldVariant.COMPACT}
      >
        {
          // eslint-disable-next-line react/jsx-props-no-spreading
          <InputLabel {...inputLabelProps}>{label}</InputLabel>
        }
      </Box>
      <Box flexGrow={1}>{children}</Box>
    </Box>
  );
};

FormRow.defaultProps = defaultProps;

export default FormRow;
