import { DataTable } from "../DataTable";
import { instrumentColumns, getInstrumentRowClassName } from "./columns";
import { useFindInstrumentsQuery } from "../../hooks/useFindInstrumentsQuery";
import { LoadingState } from "../LoadingState";
import { ErrorPanel } from "../ErrorPanel";

export const FinancialInstrumentsTable = () => {
  const { data, isLoading, isError, error } = useFindInstrumentsQuery();

  if (isLoading) return <LoadingState label="Loading instruments" />;
  if (isError)
    return (
      <ErrorPanel
        title="Failed to load instruments"
        message={error?.message ?? "An unexpected error occurred."}
      />
    );
  if (!data) return null;

  return (
    <DataTable
      data={data}
      columns={instrumentColumns}
      getRowKey={(row) => row.ticker}
      getRowClassName={getInstrumentRowClassName}
    />
  );
};
