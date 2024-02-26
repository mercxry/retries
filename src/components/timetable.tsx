import ms from 'enhanced-ms';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface IProps {
    runResults: number[],
}

export function TimeTable(props: IProps) {
    function timeSinceFirstTry(results: number[], currentAttempt: number): number {
        return results.slice(0, currentAttempt + 1).reduce((a: number, b: number) => a + b, 0);
    }

    function dateAfterSleep(results: number[], currentAttempt: number): Date {
        const d = new Date;
        const sleep = timeSinceFirstTry(results, currentAttempt);

        d.setMilliseconds(d.getMilliseconds() + sleep);

        return d;
    }

    return (
        <Table className={(props.runResults.length > 0 ? "show" : "hidden")}>
            <TableHeader>
                <TableRow>
                    <TableHead>Attempt</TableHead>
                    <TableHead className='text-center'>Sleep</TableHead>
                    <TableHead className='text-center'>Time since first try</TableHead>
                    <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {props.runResults.map((r, i) => {
                    return (
                        <TableRow key={i}>
                            <TableCell>{i}</TableCell>
                            <TableCell className='text-center'>{i == 0 ? "N/A" : ms(r, { shortFormat: true })}</TableCell>
                            <TableCell className='text-center'>{i == 0 ? "N/A" : ms(timeSinceFirstTry(props.runResults, i), { shortFormat: true })}</TableCell>
                            <TableCell className="text-right">{dateAfterSleep(props.runResults, i).toLocaleString()}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
