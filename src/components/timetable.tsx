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
    function dateAfterSleep(sleepArr: number[]): Date {
        const sleep = sleepArr.reduce((a, b) => a + b, 0);
        const d = new Date;

        d.setMilliseconds(d.getMilliseconds() + sleep);

        return d;
    }

    return (
        <Table className={(props.runResults.length > 0 ? "show" : "hidden")}>
            <TableHeader>
                <TableRow>
                    <TableHead>Attempt</TableHead>
                    <TableHead>Sleep</TableHead>
                    <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {props.runResults.map((r, i) => {
                    return (
                        <TableRow key={i}>
                            <TableCell>{i}</TableCell>
                            <TableCell>{i == 0 ? "N/A" : ms(r, { shortFormat: true })}</TableCell>
                            <TableCell className="text-right">{dateAfterSleep(props.runResults.slice(0, i + 1)).toLocaleString()}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
