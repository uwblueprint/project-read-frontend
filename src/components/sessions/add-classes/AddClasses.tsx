/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line import/order
import React, { useState } from "react";
import { Box, Typography } from "@material-ui/core";

import { ClassRequest } from "api/types";

import ClassForm, { ClassFormData, generateKey } from "./ClassForm";

type Props = {
  classes: ClassRequest[];
  onChangeClasses: (classes: ClassRequest[]) => void;
};

const AddClasses = ({ classes, onChangeClasses }: Props) => {
  const classRequestToClassFormData = (
    classesData: ClassRequest[]
  ): ClassFormData[] =>
    classesData.map((classData, i) => ({ ...classData, index: i }));

  const [classFormData, setClassFormData] = useState<ClassFormData[]>(
    classRequestToClassFormData(classes)
  );

  const handleChange = (classesData: ClassFormData[]) => {
    setClassFormData(classesData);
    const submitClassesData = classesData.map(
      (classData) => classData as ClassRequest
    );
    onChangeClasses(submitClassesData);
  };

  return (
    <div>
      <Box marginBottom={3}>
        <Box marginBottom={1}>
          <Typography variant="h3">Class information</Typography>
        </Box>
        <Typography variant="body2">
          New classes can be added after session creation as well.
        </Typography>
      </Box>
      <Box width={488}>
        <ClassForm
          dense={false}
          onChange={(classesData) => handleChange(classesData)}
          classesData={classFormData}
        />
      </Box>
    </div>
  );
};

export default AddClasses;
