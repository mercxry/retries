import React from "react"
import ms from 'enhanced-ms';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TimeTable } from "./components/timetable"
/* import { StrategySelector } from "./components/strategy-selector" */

function App() {
    const defaultVariables = new Map([
        ["base", 2],
        ["min_sleep", 1000],
        ["max_sleep", 1800000],
        ["min_jitter_factor", 0.0],
        ["max_jitter_factor", 1.0],
        ["max_attempts", 10],
    ]);

    const [formula, setFormula] = React.useState("min(max_sleep, min_sleep * (base ** attempt))");
    const [variables, setVariables] = React.useState(defaultVariables);
    const [runResults, setRunResults] = React.useState([]);
    const [errors, setErrors] = React.useState(new Map());

    function calculate() {
        let pre = "const{min,max,random}=Math;";
        variables.forEach((v, k) => pre = pre.concat(`const ${k}=${v};`));
        pre = pre.concat(`let run=[0];for(const attempt of Array(max_attempts).keys())run.push(${formula});run`)

        setRunResults(eval(pre));
    }

    function handleFormulaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        let value = e.currentTarget.value;
        if (e.currentTarget.value == "" || e.currentTarget.value == undefined) {
            value = "min(max_sleep, min_sleep * (base ** attempt))";
        }

        setFormula(value);
    }

    function handleVariableNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.value == "" || e.currentTarget.value == undefined) {
            variables.set(e.currentTarget.id, defaultVariables.get(e.currentTarget.id) || 0);
        } else {
            variables.set(e.currentTarget.id, Number(e.currentTarget.value));
        }

        setVariables(variables);
    }

    function handleVariableDurationChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.value == "" || e.currentTarget.value == undefined) {
            variables.set(e.currentTarget.id, defaultVariables.get(e.currentTarget.id) || 0);
        } else {
            const humanDuration = ms(e.currentTarget.value);
            if (humanDuration == null) {
                errors.set(e.currentTarget.id, "Invalid duration");
                setErrors(errors);
            } else {
                errors.delete(e.currentTarget.id);
                setErrors(errors);

                const value = ms(e.currentTarget.value) || defaultVariables.get(e.currentTarget.id) || 0;
                variables.set(e.currentTarget.id, value);
            }
        }

        setVariables(variables);
    }

    function getDefaultNumberPlaceholder(id: string): string {
        return defaultVariables.get(id)?.toString() || "???";
    }

    function getDefaultDurationPlaceholder(id: string): string {
        const v = defaultVariables.get(id);
        if (v != undefined) {
            return ms(v, { shortFormat: true }) || "???";
        } else {
            return "???";
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
                            placeholder="min(max_sleep, min_sleep * (base ** attempt))"
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
                            <Input
                                id="base"
                                className="w-[320px]"
                                placeholder={getDefaultNumberPlaceholder("base")}
                                onChange={handleVariableNumberChange}
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
                                <Label htmlFor="min_sleep">Minimum sleep</Label>
                                <Input id="min_sleep" className="w-[150px]" placeholder={getDefaultDurationPlaceholder("min_sleep")} onChange={handleVariableDurationChange} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="max_sleep">Maximum sleep</Label>
                                <Input id="max_sleep" className="w-[150px]" placeholder={getDefaultDurationPlaceholder("max_sleep")} onChange={handleVariableDurationChange} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="max_attempts">Maximum attempts</Label>
                            <Input id="max_attempts" className="w-[320px]" placeholder={getDefaultNumberPlaceholder("max_attempts")} onChange={handleVariableNumberChange} />
                        </div>
                    </div>
                    <div className="flex justify-center space-x-3 mt-5">
                        <Button onClick={calculate}>Calculate</Button>
                        {/* <Button variant="outline" onClick={clearAllFields}>Clear</Button> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
