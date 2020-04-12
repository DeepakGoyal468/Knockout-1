import React from 'react';
import './styles.css';
import Dots from 'react-activity/lib/Dots';
import 'react-activity/lib/Dots/Dots.css';

class SemiFinal extends React.Component {

  render() {
    let position = this.props.position;
    let data, statusData;
    if (position === 'left') {
      statusData = this.props.semiFinalStatus[0];
      data = this.props.semiFinal[0] ? this.props.semiFinal[0] : {};
    } else {
      statusData = this.props.semiFinalStatus[1];
      data = this.props.semiFinal[1] ? this.props.semiFinal[1] : {};
    }

    return (
      <div>
        <SemiFinalItem type={ 'Winner' } number={ position === 'left' ? 1 : 2 } result={ data.winner } semiFinalStatus={ statusData } />
        <SemiFinalItem type={ 'Looser' } number={ position === 'left' ? 1 : 2 } result={ data.looser } semiFinalStatus={ statusData } />
      </div>
    );
  }
}

const SemiFinalItem = (props) => {
  return (
    <div className='semiFinal'>
      <span className='semiFinalText'>{ props.type } of Semifinal { props.number }</span>
      { props.semiFinalStatus === 2 &&
        <span className='semiFinalResult'>{ props.result }</span>
      }
      { props.semiFinalStatus === 1 &&
        <span className='semiFinalResult'><Dots color='#03823a' /></span>
      }

      { props.semiFinalStatus === 0 &&
        <span className='semiFinalResult'>{ '---' }</span>
      }

    </div>
  );
}

export default SemiFinal;