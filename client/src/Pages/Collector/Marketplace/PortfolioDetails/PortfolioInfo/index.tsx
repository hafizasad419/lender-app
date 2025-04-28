import { Users, Building2, ClipboardList, Banknote, CalendarDays, Coins, TimerReset, FileText } from "lucide-react";

const PortfolioInfo = ({ portfolio }: { portfolio: any }) => {
    const details = [
        { label: "Lender Name", value: portfolio.lenderName, icon: <Users className="w-5 h-5 mr-2 text-zinc-500" /> },
        { label: "Organization", value: portfolio.lenderOrganization, icon: <Building2 className="w-5 h-5 mr-2 text-zinc-500" /> },
        { label: "Portfolio Name", value: portfolio.portfolioName, icon: <ClipboardList className="w-5 h-5 mr-2 text-zinc-500" /> },
        { label: "Face Value", value: `$${portfolio.portfolioFaceValue}`, icon: <Banknote className="w-5 h-5 mr-2 text-zinc-500" /> },
        { label: "Posted", value: `${portfolio.postedDaysAgo === 0 ? "Today" : portfolio.postedDaysAgo === 1 ? "Yesterday" : portfolio.postedDaysAgo + " days ago"}`, icon: <CalendarDays className="w-5 h-5 mr-2 text-zinc-500" /> },
        { label: "Avg Debt Size", value: `$${portfolio.averageDebtSize.toFixed(0)}`, icon: <Coins className="w-5 h-5 mr-2 text-zinc-500" /> },
        { label: "Avg Debt Age", value: `${portfolio.averageDebtAgeInMonths.toFixed(0)} months`, icon: <TimerReset className="w-5 h-5 mr-2 text-zinc-500" /> },
        { label: "Total Debtors", value: portfolio.totalDebtors, icon: <Users className="w-5 h-5 mr-2 text-zinc-500" /> },
        { label: "Portfolio ID", value: portfolio.portfolioId, icon: <FileText className="w-5 h-5 mr-2 text-zinc-500" /> },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-zinc">{portfolio.lenderName}</h1>
            <p className="text-zinc-500 text-sm mt-1 mb-6">{portfolio.lenderOrganization}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {details.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 border rounded-xl bg-white shadow-sm">
                        {item.icon}
                        <div className="flex flex-col">
                            <span className="text-zinc-500 font-medium">{item.label}</span>
                            <span className="text-zinc font-semibold overflow-ellipsis">{item.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PortfolioInfo;
