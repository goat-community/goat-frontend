// general queries

function createComparisonCondition(
  op: string,
  key: string,
  value: string | number,
) {
  return `{"op":"${op}","args":[{"property":"${key}"},${
    typeof value === "string" ? `"${value}"` : value
  }]}`;
}

// function createInclusionCondition(
//   op: string,
//   key: string,
//   values: (string | number)[],
// ) {
//   return `{"op":"${op}","args":[{"property":"${key}"},${JSON.stringify(
//     values,
//   )}]}`;
// }

function createNestedCondition(
  outerOp: string,
  key: string,
  value: string,
  innerOp?: string,
) {
  return `{"op": "${outerOp}","args": [
      ${
        innerOp
          ? `{"op":"${innerOp}","args":[{"property":"${key}"},"${value}"]}`
          : `{ "property":"${key}"},
      "${value}"`
      }]}`;
}

export function is(key: string, value: string | number) {
  return createComparisonCondition("=", key, value);
}

export function is_not(key: string, value: string | number) {
  return createComparisonCondition("!=", key, value);
}

export function includes(key: string, values: (string | number)[]) {
  const args =
    typeof values === "string" ? [] : values.map((value) => is(key, value));
  return or_operator(args);
}

export function excludes(key: string, values: (string | number)[]) {
  const args =
    typeof values === "string" ? [] : values.map((value) => is_not(key, value));
  return and_operator(args);
}

export function starts_with(key: string, value: string) {
  return createNestedCondition("like", key, `${value}%`);
}

export function ends_with(key: string, value: string) {
  return createNestedCondition("like", key, `%${value}`);
}

export function contains_the_text(key: string, value: string) {
  return createNestedCondition("like", key, `%${value}%`);
}

export function does_not_contains_the_text(key: string, value: string) {
  return createNestedCondition("not", key, `%${value}%`, "like");
}

export function is_blank(key: string) {
  return `{
    "op": "isNull",
    "args": [
      { "property": "${key}" }
    ]
  }`;
}

export function is_not_blank(key: string) {
  return `{
    "op": "not",
    "args": [
      {
        "op": "isNull",
        "args": [
          { "property": "${key}" }
        ]
      }
    ]
  }`;
}

export function is_empty_string(key: string) {
  return createComparisonCondition("=", key, "");
}

export function is_not_empty_string(key: string) {
  return createComparisonCondition("!=", key, "");
}

export function is_at_least(key: string, value: number) {
  return createComparisonCondition(">=", key, value);
}

export function is_at_most(key: string, value: number) {
  return createComparisonCondition("<=", key, value);
}

export function is_less_than(key: string, value: number) {
  return createComparisonCondition("<", key, value);
}

export function is_greater_than(key: string, value: number) {
  return createComparisonCondition(">", key, value);
}

export function is_between(key: string, value1: number, value2: number) {
  return `{"op":"and","args":[{"op":">=","args":[{"property":"${key}"},${value1}]},{"op":"<=","args":[{"property":"${key}"},${value2}]}]}`;
}

export function bbox(value: string) {
  const coordinates = value.split(",").map((coord) => parseFloat(coord));
  // console.log(value, `{"op":"s_intersects","args":[{"property":"geometry"},{"coordinates":[[[${coordinates[2]},${coordinates[3]}],[${coordinates[0]},${coordinates[3]}],[${coordinates[0]},${coordinates[1]}],[${coordinates[2]},${coordinates[1]}],[${coordinates[2]},${coordinates[3]}]]],"type":"Polygon"}]}`)
  return `{"op":"s_intersects","args":[{"property":"geometry"},{"coordinates":[[[${coordinates[2]},${coordinates[3]}],[${coordinates[0]},${coordinates[3]}],[${coordinates[0]},${coordinates[1]}],[${coordinates[2]},${coordinates[1]}],[${coordinates[2]},${coordinates[3]}]]],"type":"Polygon"}]}`;
}

export function and_operator(args: string[]) {
  return `{"op":"and","args": [${args.map((arg) => `${arg}`)}]}`;
}

export function or_operator(args: string[]) {
  return `{"op":"or","args": [${args.map((arg) => `${arg}`)}]}`;
}

export function createTheCQLBasedOnExpression(
  expressions,
  layerAttributes: { keys: { name: string; type: string }[] },
  logicalOperator?: "and" | "or",
) {
  console.log(expressions);
  const queries = expressions
    .filter((exp) => exp.value && exp.expression && exp.attribute)
    .map((expression) => {
      const attributeType = layerAttributes.keys.filter(
        (attrib) => attrib.name === expression.attribute,
      ).length
        ? layerAttributes.keys.filter(
            (attrib) => attrib.name === expression.attribute,
          )[0].type
        : undefined;

      switch (expression.expression) {
        case "is":
          if (expression.attribute === "Bounding Box") {
            return bbox(expression.value);
          } else {
            return is(expression.attribute, expression.value);
          }
        case "is_not":
          return is_not(expression.attribute, expression.value);
        case "is_empty_string":
          return is_empty_string(expression.attribute);
        case "is_not_empty_string":
          return is_not_empty_string(expression.attribute);
        case "is_at_least":
          return is_at_least(expression.attribute, expression.value);
        case "is_less_than":
          return is_less_than(expression.attribute, expression.value);
        case "is_greater_than":
          return is_greater_than(expression.attribute, expression.value);
        case "is_at_most":
          return is_at_most(expression.attribute, expression.value);
        case "includes":
          if (attributeType === "string") {
            return includes(expression.attribute, expression.value);
          } else {
            return includes(expression.attribute, expression.value.map(Number));
          }
        case "excludes":
          if (attributeType === "string") {
            return excludes(expression.attribute, expression.value);
          } else {
            return excludes(expression.attribute, expression.value.map(Number));
          }
        case "starts_with":
          return starts_with(expression.attribute, expression.value);
        case "ends_with":
          return ends_with(expression.attribute, expression.value);
        case "contains_the_text":
          return contains_the_text(expression.attribute, expression.value);
        case "does_not_contains_the_text":
          return does_not_contains_the_text(
            expression.attribute,
            expression.value,
          );
        case "is_blank":
          return is_blank(expression.attribute);
        case "is_not_blank":
          return is_not_blank(expression.attribute);
        case "is_between":
          return is_between(
            expression.attribute,
            parseInt(expression.value.split("-")[0]),
            parseInt(expression.value.split("-")[1]),
          );
      }
    });

  if (logicalOperator === "and") {
    console.log(and_operator(queries));
    return JSON.parse(and_operator(queries));
  } else {
    return JSON.parse(or_operator(queries));
  }
}
