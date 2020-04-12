import React from 'react';
import './styles.css';
import Dots from 'react-activity/lib/Dots';
import 'react-activity/lib/Dots/Dots.css';

class GroupStage extends React.Component {

  renderGroupStage = (groups, groupStage, groupStageStatus) => {
    let data = [];
    let borderClass = this.props.position === 'right' ? ' left' : ' right';
    for (let i = 0; i < 8; i++) {
      data.push(
        <div className='stageResult' key={ i }>
          <span className={ "stageName" + (i % 2 ? borderClass : '') }>Group { groups[i].name + (i % 2 ? ' runner up' : ' winner') }</span>
          { groupStageStatus === 2 &&
            <span className={ "result" + (i % 2 ? '' : borderClass) }>{ (i % 2 ? groupStage[i].runnerup : groupStage[i].winner) }</span>
          }
          { groupStageStatus === 1 &&
            <span className={ "result" + (i % 2 ? '' : borderClass) }><Dots color='#03823a' /></span>
          }
          { groupStageStatus === 0 &&
            <span className={ "result" + (i % 2 ? '' : borderClass) }>{ '---' }</span>
          }
        </div>
      )
    }
    return data;
  }

  render() {
    let groupStage = this.props.groupStage;
    let position = this.props.position;
    let groups = this.props.groups;
    if (position === 'right') {
      for (let i = 0; i < groupStage.length; i += 2) {
        [groupStage[i], groupStage[i + 1]] = [groupStage[i + 1], groupStage[i]];
      }
    }
    if (position === 'right') {
      for (let i = 0; i < groups.length; i += 2) {
        [groups[i], groups[i + 1]] = [groups[i + 1], groups[i]];
      }
    }

    return (
      <div>
        { groups.length && this.renderGroupStage(groups, groupStage, this.props.groupStageStatus) }
      </div>
    );
  }
}

export default GroupStage;