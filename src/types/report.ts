export interface IReportStat {
  gainPercentage: number;
}

export interface ITotalRevenue extends IReportStat {
  totalRevenue: number;
}

export interface ITotalTransactions extends IReportStat {
  totalTransactions: number;
}

export interface ITotalProductsSold extends IReportStat {
  totalProductsSold: number;
}

export interface ITotalActiveUsers extends IReportStat {
  totalActiveUsers: number;
  gain: number;
}

export interface IReportStats {
  totalRevenue: ITotalRevenue;
  totalTransactions: ITotalTransactions;
  totalProductsSold: ITotalProductsSold;
  totalActiveUsers: ITotalActiveUsers;
}

export interface IMonthlyRevenue {
  year: number;
  month: number;
  totalRevenue: number;
  gainPercentage: number;
}

export interface IMonthlyRevenueResponse {
  revenues: IMonthlyRevenue[];
}

export interface IProductDistribution {
  id: string;
  name: string;
  totalSold: number;
  currentMonthSold: number;
  stock: number;
}

export interface IProductDistributionResponse {
  products: IProductDistribution[];
}

export interface ICurrentMonthTotalRevenue {
  totalRevenue: number;
  gainPercentage: number;
}

export interface ITodayTotalTransactions {
  totalTransactions: number;
  gainPercentage: number;
}

export interface ITotalProducts {
  totalProducts: number;
}
