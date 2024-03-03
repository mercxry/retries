import React from "react"
import ms from 'enhanced-ms';
import validator from 'validator';

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TimeTable } from "@/components/timetable"
import { defaultVariables } from "@/lib/variables.ts"
import { VariableInput, VariableInputKind } from "@/components/ui/variable-input.tsx";
/* import { StrategySelector } from "@/components/strategy-selector" */

function App() {
    const [formula, setFormula] = React.useState("min(maxSleep, minSleep * (base ** attempt))");
    const [variables, setVariables] = React.useState(defaultVariables);
    const [runResults, setRunResults] = React.useState([]);
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    function calculate() {
        let pre = "const{min,max,random}=Math;";
        for (const k in variables) {
            pre = pre.concat(`const ${k}=${variables[k]};`);
        }
        pre = pre.concat(`let run=[0];for(const attempt of Array(maxAttempts).keys())run.push(${formula});run`)

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
        const id = e.currentTarget.id;
        const value = e.currentTarget.value;
        const kind = e.currentTarget.getAttribute("data-kind");

        // When the user clears the input field we want to use the default value
        if (value.trim() == "" || value == undefined) {
            if (defaultVariables[id] != undefined) {
                setVariables(prev => {
                    return {
                        ...prev,
                        [id]: defaultVariables[id],
                    }
                });
                setErrors(prev => {
                    delete prev[id];
                    return {
                        ...prev,
                    }
                });
            } else {
                // The default value should always be there
                // but if not we should handle that case as well
                setErrors(prev => {
                    return {
                        ...prev,
                        [id]: "No default value for this field",
                    }
                });
            }

            // We don't need to continue if the field is empty
            // this avoids the code below setting an error if there is already a default
            return;
        }

        // Validate the input field based on the kind
        switch (kind) {
            case VariableInputKind.Number: {
                if (validator.isInt(value)) {
                    setVariables(prev => {
                        return {
                            ...prev,
                            [id]: Number(value),
                        }
                    });
                    setErrors(prev => {
                        delete prev[id];
                        return {
                            ...prev,
                        }
                    });
                } else {
                    setErrors(prev => {
                        return {
                            ...prev,
                            [id]: "Invalid integer",
                        }
                    });
                }
                break;
            }
            case VariableInputKind.Duration: {
                if (value.includes("ns") || Number(value) < 1) {
                    setErrors(prev => {
                        return {
                            ...prev,
                            [id]: "ns are not supported",
                        }
                    });

                    return;
                }

                const durationMs = ms(value);
                if (durationMs != null) {
                    setVariables(prev => {
                        return {
                            ...prev,
                            [id]: durationMs,
                        }
                    });
                    setErrors(prev => {
                        delete prev[id];
                        return {
                            ...prev,
                        }
                    });
                } else {
                    setErrors(prev => {
                        return {
                            ...prev,
                            [id]: "Invalid duration",
                        }
                    });
                }
                break;
            }
            default: {
                setErrors(prev => {
                    return {
                        ...prev,
                        [id]: "Invalid input kind",
                    }
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
                        <h3 className="mb-3 scroll-m-20 text-2xl font-semibold tracking-tight">Sleep Formula</h3>
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
                        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Strategy parameters</h3>
                        {/* <div className="flex flex-col space-y-2"> */}
                        {/*     <Label>Presets</Label> */}
                        {/*     <StrategySelector /> */}
                        {/* </div> */}
                        <div className="space-y-1">
                            <Label htmlFor="base">Base</Label>
                            <VariableInput
                                id="base"
                                className="w-[320px]"
                                inferPlaceholder
                                kind={VariableInputKind.Number}
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
                        <h3 className="mb-5 scroll-m-20 text-xl font-semibold tracking-tight">Calculation parameters</h3>
                        <div className="flex flex-row space-x-5">
                            <div className="space-y-1">
                                <Label htmlFor="minSleep">Minimum sleep</Label>
                                <VariableInput
                                    id="minSleep"
                                    className="w-[150px]"
                                    inferPlaceholder
                                    kind={VariableInputKind.Duration}
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
                                    kind={VariableInputKind.Duration}
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
                                kind={VariableInputKind.Number}
                                onChange={handleVariableChange}
                                error={errors.maxAttempts}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center space-x-3 mt-5">
                        <Button onClick={calculate} disabled={Object.keys(errors).length > 0}>Calculate</Button>
                        {/* <Button variant="outline" onClick={clearAllFields}>Clear</Button> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
