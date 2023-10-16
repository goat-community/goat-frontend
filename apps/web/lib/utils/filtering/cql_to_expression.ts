import type { Expression } from "@/types/map/filtering";
import { comparerModes } from "@/public/assets/data/comparers_filter";
import { comparisonAndInclussionOpperators } from "./filter_opperators";

export function parseCQLQueryToObject(
  condition: string,
  expressionKey: string,
) {
  const fixedCondition = condition.replace(/\\/g, '\\\\')
  const parsedCondition = JSON.parse(fixedCondition);

  const proccessedExpression: Expression = {
    expression: null,
    attribute: null,
    id: expressionKey,
    value: null,
  };

  if (Object.keys(parsedCondition).length) {
    const comparerType =
      typeof parsedCondition.args[1] === "string"
        ? "text"
        : typeof parsedCondition.args[1];

    const modeKey = comparerModes[comparerType].filter(
      (key) => key.value === parsedCondition.op,
    );
    if (parsedCondition.op === "like") {
      const value = parsedCondition.args[1];
      proccessedExpression.attribute = parsedCondition.args[0].property;
      if ("%" in parsedCondition.args[1]) {
        proccessedExpression.value = parsedCondition.args[1].replace("%", "");
      } else {
        proccessedExpression.value = parsedCondition.args[1];
      }

      switch (true) {
        case value.startsWith("%") && value.endsWith("%"):
          proccessedExpression.expression = {
            label: "contains_the_text",
            value: "contains_the_text",
            type: "text",
            select: false,
          };
        case value.startsWith("%"):
          proccessedExpression.expression = {
            label: "starts_with",
            value: "starts_with",
            type: "text",
            select: false,
          };
        case value.endsWith("%"):
          proccessedExpression.expression = {
            label: "ends_with",
            value: "ends_with",
            type: "text",
            select: false,
          };
        default:
          proccessedExpression.expression = {
            label: "does_not_contains_the_text",
            value: "does_not_contains_the_text",
            type: "text",
            select: false,
          };
      }
    } else if (parsedCondition.args.length === 1) {
      switch (true) {
        case parsedCondition.op === "isNull":
          proccessedExpression.expression = {
            label: "is_blank",
            value: "is_blank",
            type: "none",
            select: false,
          };
        case parsedCondition.op === "not":
          proccessedExpression.expression = {
            label: "is_not_blank",
            value: "is_not_blank",
            type: "none",
            select: false,
          };
      }
    } else if (
      "args" in parsedCondition.args[0] &&
      parsedCondition.args.length === 2
    ) {
      proccessedExpression.expression = {
        label: "is_between",
        value: "is_between",
        type: "number",
        select: false,
      };
    } else {
      proccessedExpression.expression = comparerModes[comparerType].filter(
        (key) =>
          key.value ===
          Object.keys(comparisonAndInclussionOpperators).filter(
            (comp) =>
              comparisonAndInclussionOpperators[comp] === parsedCondition.op,
          )[0],
      )[0];
      proccessedExpression.attribute = parsedCondition.args[0].property;
      proccessedExpression.value = parsedCondition.args[1];
    }
    return proccessedExpression;
  } else {
    return proccessedExpression;
  }

  // return {
  //   id: expressionKey,
  //   attribute: parsedCondition.op,
  //   expression: parsedCondition.args[0].property,
  //   value: parsedCondition.args[1]
  // };
}
