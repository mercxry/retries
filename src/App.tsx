import React, { useEffect } from "react";
import ms from "enhanced-ms";
import validator from "validator";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TimeTable } from "@/components/timetable";
import { VariableKind, Variables, defaultVariables } from "@/lib/variables.ts";
import { VariableInput } from "@/components/ui/variable-input.tsx";
import { StrategySelector } from "@/components/strategy-selector";
import { PresetSelectedEvent } from "@/lib/events/preset-selected";
import { ArrayToInterface } from "@/lib/utils";

const inputKeys = Object.keys(defaultVariables);
type Inputs = ArrayToInterface<typeof inputKeys>;

function App() {
  const [formula, setFormula] = React.useState(
    "min(maxSleep, minSleep * (base ** attempt))",
  );
  const [variables, setVariables] = React.useState(defaultVariables);
  const [inputs, setInputs] = React.useState(
    Object.keys(defaultVariables).reduce(
      (res: Inputs, k: string) => {
        const variable = defaultVariables[k as keyof Variables];
        let value: string | number = variable.value;

        if (variable.kind == VariableKind.Duration) {
          value = ms(value, { shortFormat: true }) || value.toString();
        }

        res[k] = value.toString();
        return res;
      },
      Object.fromEntries(inputKeys.map((k) => [k, ""])),
    ),
  );
  const [runResults, setRunResults] = React.useState([]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  useEffect(() => {
    window.addEventListener("presetSelected", handlePresetSelected);
    return () => {
      window.removeEventListener("presetSelected", handlePresetSelected);
    };
  }, []);

  function handlePresetSelected(e: CustomEvent<PresetSelectedEvent>) {
    setFormula(e.detail.formula);
    setVariables(e.detail.variables);

    Object.keys(e.detail.variables).forEach((inputId) => {
      const variable = e.detail.variables[inputId as keyof Variables];
      let value: string | number = variable.value;

      if (variable.kind == VariableKind.Duration) {
        value = ms(value, { shortFormat: true }) || value.toString();
      }

      setInputs((prev) => {
        return {
          ...prev,
          [inputId]: value.toString(),
        };
      });
    });

    const formulaEl = document.getElementById("formula");
    if (formulaEl != undefined) {
      formulaEl!.innerText = e.detail.formula;
    }
  }

  function calculate() {
    let pre = "const{min,max,random}=Math;";
    for (const k in variables) {
      pre = pre.concat(`const ${k}=${variables[k as keyof Variables].value};`);
    }
    pre = pre.concat(
      `let run=[0];for(const attempt of Array(maxAttempts).keys())run.push(${formula});run`,
    );

    setRunResults(eval(pre));
  }

  function handleFormulaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    let value = e.currentTarget.value;
    if (e.currentTarget.value == "" || e.currentTarget.value == undefined) {
      value = "min(maxSleep, minSleep * (base ** attempt))";
    }

    setFormula(value);
  }

  function handleVariableChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputId = e.currentTarget.id;
    const inputValue = e.currentTarget.value;
    const inputKind = e.currentTarget.getAttribute("data-kind");

    const defaultVariable = defaultVariables[inputId as keyof Variables];

    setInputs((prev) => {
      return {
        ...prev,
        [inputId]: inputValue,
      };
    });

    // When the user clears the input field we want to use the default value
    if (inputValue.trim() == "" || inputValue == undefined) {
      if (defaultVariable != undefined) {
        setVariables((prev) => {
          return {
            ...prev,
            [inputId]: defaultVariable,
          };
        });
        setErrors((prev) => {
          delete prev[inputId];
          return {
            ...prev,
          };
        });
      } else {
        // The default value should always be there
        // but if not we should handle that case as well
        setErrors((prev) => {
          return {
            ...prev,
            [inputId]: "No default value for this field",
          };
        });
      }

      // We don't need to continue if the field is empty
      // this avoids the code below setting an error if there is already a default
      return;
    }

    // Validate the input field based on the kind
    switch (inputKind) {
      case VariableKind.Number: {
        if (validator.isInt(inputValue)) {
          setVariables((prev) => {
            return {
              ...prev,
              [inputId]: {
                kind: VariableKind.Number,
                value: Number(inputValue),
              },
            };
          });
          setErrors((prev) => {
            delete prev[inputId];
            return {
              ...prev,
            };
          });
        } else {
          setErrors((prev) => {
            return {
              ...prev,
              [inputId]: "Invalid integer",
            };
          });
        }
        break;
      }
      case VariableKind.Duration: {
        if (inputValue.includes("ns") || Number(inputValue) < 1) {
          setErrors((prev) => {
            return {
              ...prev,
              [inputId]: "ns are not supported",
            };
          });

          return;
        }

        const durationMs = ms(inputValue);
        if (durationMs != null) {
          setVariables((prev) => {
            return {
              ...prev,
              [inputId]: {
                kind: VariableKind.Duration,
                value: durationMs,
              },
            };
          });
          setErrors((prev) => {
            delete prev[inputId];
            return {
              ...prev,
            };
          });
        } else {
          setErrors((prev) => {
            return {
              ...prev,
              [inputId]: "Invalid duration",
            };
          });
        }
        break;
      }
      default: {
        setErrors((prev) => {
          return {
            ...prev,
            [inputId]: "Invalid input kind",
          };
        });
        break;
      }
    }
  }

  return (
    <>
      {/* <div className='flex space-x-20 justify-center items-center h-16 border-b'> */}
      {/*     <nav className='space-x-4'> */}
      {/*         <span>Playground</span> */}
      {/*         <span>About</span> */}
      {/*     </nav> */}
      {/* </div> */}
      <div className="flex justify-center mt-10 space-x-20">
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="mb-3 scroll-m-20 text-2xl font-semibold tracking-tight">
              Sleep Formula
            </h3>
            <Textarea
              id="formula"
              className="w-[800px]"
              placeholder="min(maxSleep, minSleep * (base ** attempt))"
              onChange={handleFormulaChange}
            />
          </div>
          <TimeTable runResults={runResults} />
        </div>
        <div>
          <div className="space-y-5">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Strategy parameters
            </h3>
            <div className="flex flex-col space-y-2">
              <Label>Preset</Label>
              <StrategySelector />
            </div>
            <div className="space-y-1">
              <Label htmlFor="base">Base</Label>
              <VariableInput
                id="base"
                className="w-[320px]"
                inferPlaceholder
                kind={VariableKind.Number}
                value={inputs.base}
                onChange={handleVariableChange}
                error={errors.base}
              />
            </div>
            {/* <div className="flex flex-row space-x-5"> */}
            {/*     <div className="space-y-1"> */}
            {/*         <Label htmlFor="min_jitter_factor">Minimum jitter factor</Label> */}
            {/*         <Input id="min_jitter_factor" className="w-[150px]" placeholder="0.0" onChange={handleVariableChange} /> */}
            {/*     </div> */}
            {/*     <div className="space-y-1"> */}
            {/*         <Label htmlFor="max_jitter_factor">Maximum jitter factor</Label> */}
            {/*         <Input id="max_jitter_factor" className="w-[150px]" placeholder="1.0" onChange={handleVariableChange} /> */}
            {/*     </div> */}
            {/* </div> */}
          </div>
          <div className="mt-14 space-y-5">
            <h3 className="mb-5 scroll-m-20 text-xl font-semibold tracking-tight">
              Calculation parameters
            </h3>
            <div className="flex flex-row space-x-5">
              <div className="space-y-1">
                <Label htmlFor="minSleep">Minimum sleep</Label>
                <VariableInput
                  id="minSleep"
                  className="w-[150px]"
                  inferPlaceholder
                  kind={VariableKind.Duration}
                  value={inputs.minSleep}
                  onChange={handleVariableChange}
                  error={errors.minSleep}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="maxSleep">Maximum sleep</Label>
                <VariableInput
                  id="maxSleep"
                  className="w-[150px]"
                  inferPlaceholder
                  kind={VariableKind.Duration}
                  value={inputs.maxSleep}
                  onChange={handleVariableChange}
                  error={errors.maxSleep}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="maxAttempts">Maximum attempts</Label>
              <VariableInput
                id="maxAttempts"
                className="w-[320px]"
                inferPlaceholder
                kind={VariableKind.Number}
                value={inputs.maxAttempts}
                onChange={handleVariableChange}
                error={errors.maxAttempts}
              />
            </div>
          </div>
          <div className="flex justify-center space-x-3 mt-5">
            <Button
              onClick={calculate}
              disabled={Object.keys(errors).length > 0}
            >
              Calculate
            </Button>
            {/* <Button variant="outline" onClick={clearAllFields}>Clear</Button> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
