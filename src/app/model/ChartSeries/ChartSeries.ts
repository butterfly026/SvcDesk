export interface ChartSeries {
    Name: string,
    DataPointList: {
        ChartDataPoint: {
            XValue: string,
            YValue: string,
            Annotation: string
        }
    }
}
