/*
Copyright (C) 2017  Cloudbase Solutions SRL
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// @flow

import React from 'react'
import styled from 'styled-components'

import StatusPill from '../../atoms/StatusPill'
import CopyValue from '../../atoms/CopyValue'
import Button from '../../atoms/Button'
import Timeline from '../../molecules/Timeline'
import Tasks from '../../organisms/Tasks'

import type { MainItem } from '../../../types/MainItem'
import type { Execution } from '../../../types/Execution'
import Palette from '../../styleUtils/Palette'
import DateUtils from '../../../utils/DateUtils'

import executionImage from './images/execution.svg'

const Wrapper = styled.div`
`
const ExecutionInfo = styled.div`
  background: ${Palette.grayscale[1]};
  padding: 24px 16px;
  display: flex;
  align-items: center;
  margin-top: 16px;
`
const ExecutionInfoNumber = styled.div`
  font-size: 16px;
  padding-right: 24px;
`
const ExecutionInfoDate = styled.div`
  color: ${Palette.grayscale[4]};
  margin-right: 16px;
`
const ExecutionInfoId = styled.div`
  color: ${Palette.grayscale[4]};
  display: flex;
  margin-right: 16px;
  flex-grow: 1;
`
const NoExecutions = styled.div`
  background: ${Palette.grayscale[7]};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 74px;
`
const ExecutionImage = styled.div`
  width: 96px;
  height: 96px;
  background: url('${executionImage}');
  margin: 106px 0 43px 0;
`
const NoExecutionTitle = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
`
const NoExecutionText = styled.div`
  color: ${Palette.grayscale[4]};
  margin-bottom: 48px;
`

type Props = {
  item: MainItem,
  onCancelExecutionClick: (execution: ?Execution) => void,
  onDeleteExecutionClick: (execution: ?Execution) => void,
  onExecuteClick: () => void,
}
type State = {
  selectedExecution: ?Execution,
}
class Executions extends React.Component<Props, State> {
  constructor() {
    super()

    this.state = {
      selectedExecution: null,
    }
  }

  componentWillMount() {
    this.setSelectedExecution(this.props)
  }

  componentWillReceiveProps(props: Props) {
    this.setSelectedExecution(props)
  }

  setSelectedExecution(props: Props) {
    let lastExecution = this.getLastExecution(props)
    let selectExecution = null

    if (props.item.executions && this.props.item.executions) {
      if (this.props.item.executions.length !== props.item.executions.length
        && lastExecution.status === 'RUNNING') {
        selectExecution = lastExecution
      }

      if (this.props.item.executions.length > props.item.executions.length) {
        // $FlowIssue
        let isSelectedAvailable = props.item.executions.find(e => e.id === this.state.selectedExecution.id)
        if (!isSelectedAvailable) {
          // $FlowIssue
          let lastIndex = this.props.item.executions.findIndex(e => e.id === this.state.selectedExecution.id)

          if (props.item.executions.length) {
            if (props.item.executions[lastIndex]) {
              selectExecution = props.item.executions[lastIndex]
            } else {
              selectExecution = props.item.executions[lastIndex - 1]
            }
          }
        }
      }
    }

    if (!this.state.selectedExecution) {
      this.setState({
        selectedExecution: lastExecution || null,
      })
    } else if (selectExecution) {
      this.setState({
        selectedExecution: selectExecution,
      })
    } else if (this.hasExecutions(props)) {
      // $FlowIssue
      selectExecution = props.item.executions.find(e => e.id === this.state.selectedExecution.id) || lastExecution
      this.setState({
        selectedExecution: selectExecution || null,
      })
    } else {
      this.setState({ selectedExecution: null })
    }
  }

  getLastExecution(props: Props) {
    return this.hasExecutions(props) && props.item.executions[props.item.executions.length - 1]
  }

  hasExecutions(props: Props) {
    return props.item.executions && props.item.executions.length
  }

  handlePreviousExecutionClick() {
    // $FlowIssue
    let selectedIndex = this.props.item.executions.findIndex(e => e.id === this.state.selectedExecution.id)

    if (selectedIndex === 0) {
      return
    }

    this.setState({ selectedExecution: this.props.item.executions[selectedIndex - 1] })
  }

  handleNextExecutionClick() {
    // $FlowIssue
    let selectedIndex = this.props.item.executions.findIndex(e => e.id === this.state.selectedExecution.id)

    if (selectedIndex >= this.props.item.executions.length - 1) {
      return
    }

    this.setState({ selectedExecution: this.props.item.executions[selectedIndex + 1] })
  }

  handleTimelineItemClick(item: Execution) {
    this.setState({ selectedExecution: item })
  }

  handleCancelExecutionClick() {
    this.props.onCancelExecutionClick(this.state.selectedExecution)
  }

  renderTimeline() {
    return (
      <Timeline
        items={this.props.item.executions || null}
        selectedItem={this.state.selectedExecution}
        onPreviousClick={() => { this.handlePreviousExecutionClick() }}
        onNextClick={() => { this.handleNextExecutionClick() }}
        onItemClick={item => { this.handleTimelineItemClick(item) }}
      />
    )
  }

  renderExecutionInfoButton() {
    if (!this.state.selectedExecution) {
      return null
    }

    if (this.state.selectedExecution.status === 'RUNNING') {
      return (
        <Button
          secondary
          hollow
          onClick={() => { this.handleCancelExecutionClick() }}
        >Cancel Execution</Button>)
    }

    return (
      <Button
        alert
        hollow
        onClick={() => { this.props.onDeleteExecutionClick(this.state.selectedExecution) }}
      >Delete Execution</Button>
    )
  }

  renderExecutionInfo() {
    if (!this.state.selectedExecution) {
      return null
    }

    return (
      <ExecutionInfo>
        <ExecutionInfoNumber>Execution #{this.state.selectedExecution.number}</ExecutionInfoNumber>
        <StatusPill style={{ marginRight: '16px' }} small status={this.state.selectedExecution.status} />
        <ExecutionInfoDate>
          {DateUtils.getLocalTime(this.state.selectedExecution.created_at).format('DD MMMM YYYY HH:mm')}
        </ExecutionInfoDate>
        <ExecutionInfoId>
          ID:&nbsp;<CopyValue
            width="107px"
            value={this.state.selectedExecution ? this.state.selectedExecution.id : ''}
          />
        </ExecutionInfoId>
        {this.renderExecutionInfoButton()}
      </ExecutionInfo>
    )
  }

  renderTasks() {
    if (!this.state.selectedExecution || !this.state.selectedExecution.tasks
      || !this.state.selectedExecution.tasks.length) {
      return null
    }

    return (
      <Tasks items={this.state.selectedExecution.tasks} />
    )
  }

  renderNoExecution() {
    if (this.hasExecutions(this.props)) {
      return null
    }

    return (
      <NoExecutions>
        <ExecutionImage />
        <NoExecutionTitle>It looks like there are no executions in this replica.</NoExecutionTitle>
        <NoExecutionText>This replica has not been executed yet.</NoExecutionText>
        <Button onClick={this.props.onExecuteClick}>Execute Now</Button>
      </NoExecutions>
    )
  }

  render() {
    return (
      <Wrapper>
        {this.renderTimeline()}
        {this.renderExecutionInfo()}
        {this.renderTasks()}
        {this.renderNoExecution()}
      </Wrapper>
    )
  }
}

export default Executions