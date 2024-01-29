// import { comparerModes } from "@/public/assets/data/comparers_filter";
import { comparisonAndInclussionOpperators } from "./filter_opperators";
import { v4 } from "uuid";

import type { Expression } from "@/lib/validations/filter";

function toExpressionObject(expressionsInsideLogicalOperator): Expression[] {
  console.log(expressionsInsideLogicalOperator);
  return expressionsInsideLogicalOperator.map((expressionToBeProcessed) => {
    const expression: Expression = {
      expression: "",
      attribute: "",
      value: "",
      id: v4(),
    };

    const value =
      expressionToBeProcessed.args.length > 1
        ? expressionToBeProcessed.args[1]
        : "";

    if (expressionToBeProcessed.op === "like") {
      switch (true) {
        case value.startsWith("%") && value.endsWith("%"):
          expression.expression = "contains_the_text";
          break;
        case value.endsWith("%"):
          expression.expression = "starts_with";
          break;
        case value.startsWith("%"):
          expression.expression = "ends_with";
          break;
        default:
          expression.expression = "does_not_contains_the_text";
          break;
      }
      expression.attribute = expressionToBeProcessed.args[0].property;
      expression.value = value.replace(/%/g, "");
    } else if (expressionToBeProcessed.args.length === 1) {
      switch (true) {
        case expressionToBeProcessed.op === "isNull":
          expression.expression = "is_blank";
        case expressionToBeProcessed.op === "not":
          expression.expression = "is_not_blank";
      }
      expression.attribute = expressionToBeProcessed.args[0].property;
      expression.attribute = value;
    } else if (
      "args" in expressionToBeProcessed.args[0] &&
      expressionToBeProcessed.args.length === 2
    ) {
      expression.expression = "is_between";
      expression.attribute = expressionToBeProcessed.args[0].args[0].property;
      expression.value = `${expressionToBeProcessed.args[0].args[1]}-${expressionToBeProcessed.args[1].args[1]}`;
    } else if (["and", "or"].includes(expressionToBeProcessed.op)) {
      switch (expressionToBeProcessed.op) {
        case "and":
          expression.expression = "excludes";
        case "or":
          expression.expression = "includes";
      }
      expression.attribute = expressionToBeProcessed.args[0].args[0].property;
      expression.value = expressionToBeProcessed.args.map((arg) => arg.args[1]);
    } else {
      expression.expression = Object.keys(
        comparisonAndInclussionOpperators,
      ).filter(
        (comp) =>
          comparisonAndInclussionOpperators[comp] ===
          expressionToBeProcessed.op,
      )[0];
      expression.attribute = expressionToBeProcessed.args[0].property;
      expression.value = value;
    }

    return expression;
  });
}

export function parseCQLQueryToObject(condition?: {
  op: string;
  args: unknown[];
}) {
  if (condition) {
    let expressions: Expression[] = [];
    const expressionsInsideLogicalOperator =
      condition.args;
    expressions = toExpressionObject(expressionsInsideLogicalOperator);

    return expressions;
  }

  return [];
}
