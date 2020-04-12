import React from 'react';
import './styles.css';
import fifa from '../fifa.jpeg';
import Dots from 'react-activity/lib/Dots';
import 'react-activity/lib/Dots/Dots.css';

class Final extends React.Component {

  render() {
    let final = this.props.final;
    let finalStatus = this.props.finalStatus;

    return (
      <div>
        <FinalItem type={ 'Champion' } result={ final[0] ? final[0].winner : '' } finalStatus={ finalStatus[0] } />
        <FinalItem type={ 'Runner Up' } result={ final[0] ? final[0].looser : '' } finalStatus={ finalStatus[0] } />
        <img src={ fifa } alt='hi' height={ 100 } width={ 60 }></img>
        <FinalItem type={ '3rd Place' } result={ final[1] ? final[1].winner : '' } finalStatus={ finalStatus[1] } />
        <FinalItem type={ '4th Place' } result={ final[1] ? final[1].looser : '' } finalStatus={ finalStatus[1] } />
      </div>
    );
  }
}

const FinalItem = (props) => {
  return (
    <div className='final'>
      { props.finalStatus === 2 &&
        <span className='finalResult'>{ props.result }</span>
      }
      { props.finalStatus === 1 &&
        <span className='finalResult'><Dots color='#fcba03' /></span>
      }
      { props.finalStatus === 0 &&
        <span className='finalResult'>{ '---' }</span>
      }
      <span className='finalText'>{ props.type }</span>
    </div>
  );
}

export default Final;