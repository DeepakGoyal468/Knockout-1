import React from 'react';
import './styles.css';
import Dots from 'react-activity/lib/Dots';
import 'react-activity/lib/Dots/Dots.css';

class QuarterFinal extends React.Component {

  renderQuarterFinal = (qualifier, qualifierStatus, index) => {
    let data = [];
    let borderClass = this.props.position === 'right' ? ' left' : ' right';
    for (let i = 0; i < 2; i++) {
      data.push(
        <div className='quarterFinal' key={ i }>
          <span className={ 'quarterFinalText' + (i % 2 ? borderClass : '') }>QuarterFinal { index[i] }</span>
          { qualifierStatus[i] === 2 &&
            <span className={ 'quarterFinalResult' + (i % 2 ? '' : borderClass) }>{ qualifier[i].winner }</span>
          }
          { qualifierStatus[i] === 1 &&
            <span className={ 'quarterFinalResult' + (i % 2 ? '' : borderClass) }><Dots color='#03823a' /></span>
          }
          { qualifierStatus[i] === 0 &&
            <span className={ 'quarterFinalResult' + (i % 2 ? '' : borderClass) }>{ '---' }</span>
          }
        </div>
      )
    }
    return data;
  }

  render() {
    let quarterFinal = [];
    let position = this.props.position;
    let quarterFinalStatus = [];
    let index = [];
    let startIndex = position === 'left' ? 0 : 1;
    for (let i = startIndex; i < 4; i += 2) {
      quarterFinal.push(this.props.quarterFinal[i]);
      quarterFinalStatus.push(this.props.quarterFinalStatus[i]);
      index.push(i + 1);
    }
    return (
      <div>
        { this.renderQuarterFinal(quarterFinal, quarterFinalStatus, index) }
      </div>
    )
  }
}

export default QuarterFinal;