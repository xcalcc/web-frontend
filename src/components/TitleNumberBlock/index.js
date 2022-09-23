import React from 'react';
import classNames from "classnames";
import {Row, Col} from 'react-bootstrap';
import TooltipWrapper from "Components/TooltipWrapper";
import NumberWithArrow from "Components/NumberWithArrow";
import NumberWithMargin from "Components/NumberWithMargin";
import './_title-number-block.sass';

const NumberBlock = props => {
	const {
		withArrow,
		titleTooltip,
		numberTooltip,
	} = props;

	let numberBlock;
	if (withArrow) {
		numberBlock = <NumberWithArrow
			arrow={props.number && props.number > 0 ? 1 : -1 }
			number={Math.abs(props.number).toFixed(1)}
			sup
		/>
	} else {
		numberBlock = <NumberWithMargin
			number={props.number}
			margin={props.margin}
			twoLines={props.twoLines}
			numberTooltip={numberTooltip}
		/>
	}

	return <div className={classNames('title-number-block', {
		'left-divider': props.leftDivider,
		'right-divider': props.rightDivider,
	})}>
		<Row>
			<Col className='title'>
				<span>{props.title}</span>
				{
					titleTooltip &&
					<span>
						<TooltipWrapper
							tooltipText={titleTooltip}
						/>
					</span>
				}
			</Col>
		</Row>
		<Row className='number-container'>
			<Col className={classNames('number', props.color, {
				big: props.big,
				medium: props.medium,
				small: props.small,
				center: props.center,
			})}
			>
				<span>{numberBlock}</span>
				{
					numberTooltip &&
					<span>
						<sup>
							<TooltipWrapper
								tooltipText={numberTooltip}
							/>
						</sup>
					</span>
				}
			</Col>
		</Row>
	</div>;
}

export default NumberBlock;
