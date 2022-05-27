export interface LogoInterface {
  url: string
}

export interface TeamInterface {
  abbreviation: string,
  id: number,
  locationName: string,
  name: string,
  teamName: string,
  logoUrl: string
}

export interface TeamsInterface {
  [index: number]: TeamInterface
}

export interface SingleGameDataInterface {
  away: {
    id: number,
    score: number
  },
  gameDate: Date,
  gameId: number
  home: {
    id: number,
    score: number
  },
  winnerId: number
}

export interface h2hInterface {
  overall:  h2hDetailsInterface
  home: h2hDetailsInterface
  away: h2hDetailsInterface
}

export interface h2hDetailsInterface {
  wins: number,
  losses: number
}