import PageTitle from "@/components/pageTitle";
import { YearSelect } from "@/components/navigation/yearSelect";
import { MonthSelect } from "@/components/navigation/monthSelect";

export default function Dashboard() {
  return (
    <main className="flex flex-col  min-h-screen bg-black px-8 py-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <PageTitle
            title="Dashboard"
            subTitle="Gerencie e acompanhe suas finanças"
          />
        </div>

        <div className="flex gap-4 shrink-0">
          <div className="shrink-0 min-w-[200px]">
            <YearSelect />
          </div>
          <div className="shrink-0 min-w-[200px]">
            <MonthSelect />
          </div>
        </div>
      </div>
    </main>
  );
}
