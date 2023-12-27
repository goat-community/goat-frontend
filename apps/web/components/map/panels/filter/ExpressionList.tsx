import React from "react";
import Expression from "@/components/map/panels/filter/Expression";
import { v4 } from "uuid";

import type { LayerExpressions } from "@/lib/validations/filter";
import type { UseFormSetValue } from "react-hook-form";

interface ExpressionListProps {
  expressions: LayerExpressions;
  setValue: UseFormSetValue<LayerExpressions>;
}

const ExpressionList = (props: ExpressionListProps) => {
  const { expressions, setValue } = props;

  const modifyExpression = (
    key: string,
    value: string,
    expressionId: string,
  ) => {

    const updatedExpressions = expressions.expressions.map((expression) => {
      if (expression.id === expressionId) {
        return { ...expression, [key]: value };
      } else {
        return expression;
      }
    });
    
    setValue("expressions", updatedExpressions)
  };

  return (
    <div>
      {expressions.expressions.map((expression) => (
        <Expression
          key={v4()}
          expression={expression}
          setValue={setValue}
          modifyExpression={modifyExpression}
        />
      ))}
    </div>
  );
};

export default ExpressionList;
