import React from 'react';
import teams from '../data.json';
import Groups from '../Groups';
import GroupStage from '../GroupStage';
import Qualifier from '../Qualifier';
import QuarterFinal from '../QuarterFinal';
import SemiFinal from '../SemiFinal';
import Final from '../Final';
import './styles.css';

class Game extends React.Component {

  constructor() {
    super();
    this.state = {
      groups: sessionStorage.getItem('groups') ? JSON.parse(sessionStorage.getItem('groups')) : [],
      groupStage: sessionStorage.getItem('groupStage') ? JSON.parse(sessionStorage.getItem('groupStage')) : [],
      groupStageStatus: sessionStorage.getItem('groupStageStatus') ? JSON.parse(sessionStorage.getItem('groupStageStatus')) : 0,
      qualifier: sessionStorage.getItem('qualifier') ? JSON.parse(sessionStorage.getItem('qualifier')) : [],
      qualifierStatus: sessionStorage.getItem('qualifierStatus') ? JSON.parse(sessionStorage.getItem('qualifierStatus')) : [0, 0, 0, 0, 0, 0, 0, 0],
      quarterFinal: sessionStorage.getItem('quarterFinal') ? JSON.parse(sessionStorage.getItem('quarterFinal')) : [],
      quarterFinalStatus: sessionStorage.getItem('quarterFinalStatus') ? JSON.parse(sessionStorage.getItem('quarterFinalStatus')) : [0, 0, 0, 0],
      semiFinal: sessionStorage.getItem('semiFinal') ? JSON.parse(sessionStorage.getItem('semiFinal')) : [],
      semiFinalStatus: sessionStorage.getItem('semiFinalStatus') ? JSON.parse(sessionStorage.getItem('semiFinalStatus')) : [0, 0],
      final: sessionStorage.getItem('final') ? JSON.parse(sessionStorage.getItem('final')) : [],
      finalStatus: sessionStorage.getItem('finalStatus') ? JSON.parse(sessionStorage.getItem('finalStatus')) : [0, 0]
    }
  }

  componentDidMount() {
    let groups = sessionStorage.getItem('groups') ? JSON.parse(sessionStorage.getItem('groups')) : this.generateGroups();
    this.setState({ groups: groups }, () => {
      this.setItem('groups', groups);
      this.startTournament();
    });
  }

  setItem = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  startTournament = () => {
    let isGroupStageDone = this.state.groupStageStatus === 2;
    let isQualifierDone = this.state.qualifierStatus.lastIndexOf(2) === 7;
    let isQuarterFinalDone = this.state.quarterFinalStatus.lastIndexOf(2) === 3;
    let isSemiFinalDone = this.state.semiFinalStatus.lastIndexOf(2) === 1;
    let isFinalDone = this.state.finalStatus.lastIndexOf(2) === 1;
    if (!isGroupStageDone) {
      this.startGroupMatches();
    }
    else if (!isQualifierDone) {
      this.startQualifierMatches();
    }
    else if (!isQuarterFinalDone) {
      this.startQuarterFinal();
    }
    else if (!isSemiFinalDone) {
      this.startSemiFinal();
    }
    else if (!isFinalDone) {
      this.startFinal();
    }
  }

  shuffle = (list) => {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  getMatchStartIndex = statusArray => {
    let currentIndex = statusArray.indexOf(1);
    let nextIndex = statusArray.indexOf(0);
    let startIndex =
      currentIndex !== -1
        ? currentIndex
        : nextIndex !== -1
          ? nextIndex
          : statusArray.length;
    return startIndex;
  };

  generateGroups = () => {
    let teamList = this.shuffle(JSON.parse(JSON.stringify(teams)));
    let groups = [];
    let char = 65;
    for (let i = 0; i < teamList.length; i += 4) {
      let groupName = String.fromCharCode(char);
      groups.push({
        name: groupName,
        teams: [
          teamList[i].teamName,
          teamList[i + 1].teamName,
          teamList[i + 2].teamName,
          teamList[i + 3].teamName
        ]
      });
      char++;
    }
    return groups;
  }

  getResults = (data) => {
    let shuffledData = this.shuffle(data);
    let result = {
      "winner": shuffledData[0],
      "runnerup": shuffledData[1]
    }
    return result;
  }

  startGroupMatches = () => {
    let groupStageStatus = this.state.groupStageStatus;
    groupStageStatus = 1;
    setTimeout(() => {
      this.setState({ groupStageStatus: groupStageStatus });
      this.setItem('groupStageStatus', groupStageStatus);
    }, 1000);
    setTimeout(() => {
      this.getGroupStageResults();
    }, 3000);
  }

  getGroupStageResults = () => {
    let data = [];
    let groupData = JSON.parse(JSON.stringify(this.state.groups));
    groupData.forEach((item) => {
      let result = this.getResults(item.teams);
      data.push({ ...{ "name": item.name }, ...result });
    });

    this.setState({ groupStage: data, groupStageStatus: 2 }, () => {
      this.setItem('groupStageStatus', 2);
      this.setItem('groupStage', data);
      this.startTournament();
    });
  }

  startQualifierMatches = () => {
    let qualifierStatus = [...this.state.qualifierStatus];
    let index = this.getMatchStartIndex(qualifierStatus);
    qualifierStatus[index] = 1;
    this.setState({ qualifierStatus: qualifierStatus }, () => {
      this.setItem('qualifierStatus', qualifierStatus);
      this.getQualifierResults(index);
    });
  }

  getQualifierResults = (matchId) => {
    if (matchId < 8) {
      let qualifier = this.state.qualifier;
      let qualifierStatus = [...this.state.qualifierStatus];
      let groupStage = this.state.groupStage;
      let team = [];
      if (matchId % 2) {
        team.push(groupStage[matchId].winner, groupStage[matchId - 1].runnerup);
      }
      else {
        team.push(groupStage[matchId].winner, groupStage[matchId + 1].runnerup);
      }
      let result = this.getResults(team);
      qualifier.push({
        winner: result.winner, looser: result.runnerup
      });
      if (matchId !== 7) {
        qualifierStatus[matchId + 1] = 1;
      }
      qualifierStatus[matchId] = 2;
      setTimeout(() => {
        this.setState({ qualifierStatus: qualifierStatus, qualifier: qualifier });
        this.setItem('qualifierStatus', qualifierStatus);
        this.setItem('qualifier', qualifier);
        this.getQualifierResults(matchId + 1);
      }, 1000);
    }
    else {
      this.startTournament();
    }
  }

  startQuarterFinal = () => {
    let quarterFinalStatus = [...this.state.quarterFinalStatus];
    let index = this.getMatchStartIndex(quarterFinalStatus);
    quarterFinalStatus[index] = 1;
    this.setState({ quarterFinalStatus: quarterFinalStatus }, () => {
      this.setItem('quarterFinalStatus', quarterFinalStatus);
      this.getQuarterFinalResults(index);
    });
  }

  getQuarterFinalResults = (matchId) => {
    if (matchId < 4) {
      let quarterFinal = this.state.quarterFinal;
      let qualifier = this.state.qualifier;
      let quarterFinalStatus = [...this.state.quarterFinalStatus];
      let team = [];
      if (matchId < 2) {
        team.push(qualifier[matchId].winner, qualifier[matchId + 2].winner);
      }
      else {
        team.push(qualifier[matchId + 2].winner, qualifier[matchId + 4].winner);
      }
      let result = this.getResults(team);
      quarterFinal.push({
        winner: result.winner, looser: result.runnerup
      });

      if (matchId !== 3) {
        quarterFinalStatus[matchId + 1] = 1;
      }
      quarterFinalStatus[matchId] = 2;
      setTimeout(() => {
        this.setState({ quarterFinalStatus: quarterFinalStatus, quarterFinal: quarterFinal });
        this.setItem('quarterFinalStatus', quarterFinalStatus);
        this.setItem('quarterFinal', quarterFinal);
        this.getQuarterFinalResults(matchId + 1);
      }, 1000);
    }
    else {
      this.startTournament();
    }
  }

  startSemiFinal = () => {
    let semiFinalStatus = [...this.state.semiFinalStatus];
    let index = this.getMatchStartIndex(semiFinalStatus);
    semiFinalStatus[index] = 1;
    this.setState({ semiFinalStatus: semiFinalStatus }, () => {
      this.setItem('semiFinalStatus', semiFinalStatus);
      this.getSemiFinalResults(index);
    })
  }

  getSemiFinalResults = (matchId) => {
    if (matchId < 2) {
      let semiFinal = this.state.semiFinal;
      let quarterFinal = this.state.quarterFinal;
      let semiFinalStatus = [...this.state.semiFinalStatus];
      let team = [];
      team.push(quarterFinal[matchId].winner, quarterFinal[matchId + 2].winner);

      let result = this.getResults(team);
      semiFinal.push({
        winner: result.winner, looser: result.runnerup
      });
      if (matchId !== 1) {
        semiFinalStatus[matchId + 1] = 1;
      }
      semiFinalStatus[matchId] = 2;
      setTimeout(() => {
        this.setState({ semiFinalStatus: semiFinalStatus, semiFinal: semiFinal });
        this.setItem('semiFinalStatus', semiFinalStatus);
        this.setItem('semiFinal', semiFinal);
        this.getSemiFinalResults(matchId + 1);
      }, 1000);
    }
    else {
      this.startTournament();
    }
  }

  startFinal = () => {
    let finalStatus = [...this.state.finalStatus];
    let index = this.getMatchStartIndex(finalStatus);
    finalStatus[index] = 1;
    this.setState({ finalStatus: finalStatus }, () => {
      this.setItem('finalStatus', finalStatus);
      this.getFinalResults(index);
    });
  }

  getFinalResults = (matchId) => {
    if (matchId < 2) {
      let final = this.state.final;
      let semiFinal = this.state.semiFinal;
      let finalStatus = [...this.state.finalStatus];
      let team = [];
      if (matchId % 2)
        team.push(semiFinal[matchId].looser, semiFinal[matchId - 1].looser);
      else
        team.push(semiFinal[matchId].winner, semiFinal[matchId + 1].winner);
      let result = this.getResults(team);
      final.push({
        winner: result.winner, looser: result.runnerup
      });

      if (matchId !== 1) {
        finalStatus[matchId + 1] = 1;
      }
      finalStatus[matchId] = 2;
      setTimeout(() => {
        this.setState({ finalStatus: finalStatus, final: final });
        this.setItem('finalStatus', finalStatus);
        this.setItem('final', final);
        this.getFinalResults(matchId + 1);
      }, 1000);
    }
    else {
      this.startTournament();
    }
  }

  render() {
    let state = this.state;
    return (
      <div className="game">
        <div className='teams-wrapper'>
          <Groups groups={ state.groups } position={ 'left' } />
        </div>
        <div className='teams-wrapper'>
          <GroupStage groups={ state.groups } groupStage={ state.groupStage } groupStageStatus={ state.groupStageStatus } position={ 'left' } />
        </div>
        <div className='teams-wrapper'>
          <Qualifier qualifier={ state.qualifier } qualifierStatus={ state.qualifierStatus } position={ 'left' } />
        </div>
        <div className='teams-wrapper'>
          <QuarterFinal quarterFinal={ state.quarterFinal } quarterFinalStatus={ state.quarterFinalStatus } position={ 'left' } />
        </div>
        <div className='teams-wrapper'>
          <SemiFinal semiFinal={ state.semiFinal } semiFinalStatus={ state.semiFinalStatus } position={ 'left' } />
        </div>
        <div className='teams-wrapper'>
          <Final final={ state.final } finalStatus={ state.finalStatus } />
        </div>
        <div className='teams-wrapper'>
          <SemiFinal semiFinal={ state.semiFinal } semiFinalStatus={ state.semiFinalStatus } position={ 'right' } />
        </div>
        <div className='teams-wrapper'>
          <QuarterFinal quarterFinal={ state.quarterFinal } quarterFinalStatus={ state.quarterFinalStatus } position={ 'right' } />
        </div>
        <div className='teams-wrapper'>
          <Qualifier qualifier={ state.qualifier } qualifierStatus={ state.qualifierStatus } position={ 'right' } />
        </div>
        <div className='teams-wrapper'>
          <GroupStage groups={ state.groups } groupStage={ state.groupStage } groupStageStatus={ state.groupStageStatus } position={ 'right' } />
        </div>
        <div className='teams-wrapper'>
          <Groups groups={ state.groups } position={ 'right' } />
        </div>
      </div>
    );
  }
}

export default Game;