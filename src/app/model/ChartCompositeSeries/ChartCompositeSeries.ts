export interface ChartCompositeSeries {
    Name: string,
    SeriesList: {
        ChartSeries: {
            Name: string,
            DataPointList: {
                ChartDataPoint: {
                    XValue: string,
                    YValue: string,
                    Annotation: string
                }
            }
        }
    }
}
