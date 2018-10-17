//Vendors
import React from 'react'
import styled from 'styled-components'
import { TweenMax } from 'gsap'
import Hammer from 'react-hammerjs'

//Components

//Images
import IconArrow from '../../images/icons/downArrow.svg'

//Functions

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setComment } from '../../services/Redux/Comment/actions'

//define actions
function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			setComment
		},
		dispatch
	)
}
//Set global state to prop
function mapStateToProps(state) {
	return { Comment: state.Comment }
}
class Comment extends React.Component {
	//initial state
	constructor(props) {
		super(props)
		this.state = {
			...props,
			comment: ''
		}
	}

	//Methods
	hideComment = () => {
		document.querySelector('#ExpenseComment').blur()

		let CommentDialog = document.querySelector('#CommentDialog')
		TweenMax.to(CommentDialog, 0.2, { top: '-100%' })
		this.props.setComment('')
	}

	handleComment = (e) => {
		this.props.setComment(e.target.value)
	}

	setComment = () => {
		let CommentDialog = document.querySelector('#CommentDialog')
		TweenMax.to(CommentDialog, 0.2, { top: '-100%' })
	}
	render() {
		//Properties

		//Template
		return (
			<Hammer onSwipe={this.hideComment} direction="DIRECTION_UP">
				<div>
					<Wrapper id="CommentDialog">
						<Header>
							<h2>Add Comment</h2>
							<img src={IconArrow} alt="arrow" onClick={this.hideComment} />
						</Header>
						<Content id="ExpenseComment" placeholder="Type Here.." value={this.props.Comment} onChange={this.handleComment} />

						<Button onClick={this.setComment}>Add</Button>
					</Wrapper>
				</div>
			</Hammer>
		)
	}
}

//Style
const Wrapper = styled.div`
	background: white;
	position: fixed;
	height: 100%;
	width: 100%;
	top: -100%;
	left: 0;
	z-index: 3;
	display: grid;
	grid-template-columns: 100%;
	grid-template-rows: auto 1fr 40px;
	padding: 10px;
	box-sizing: border-box;
	grid-row-gap: 10px;
`
const Header = styled.div`
	position: relative;
	h2 {
		color: var(--colorBg);
		text-align: center;
		margin: 0;
	}

	img {
		width: 20px;
		transform: rotate(180deg);
		cursor: pointer;
		position: absolute;
		right: 0;
		top: 0;
	}
`
const Content = styled.textarea`
	font-size: 16px;
	outline: none;
	border: none;
	&:focus {
		outline: none;
	}
`
const Button = styled.button`
	display: block;
	margin: 0 auto;
	background: none;
	border: solid 1px var(--colorBg);
	border-radius: 50px;
	width: 100px;
	font-size: 16px;
	font-weight: bold;
	&:focus {
		outline: none;
		border: solid 3px var(--colorBg);
	}
`
export default connect(mapStateToProps, mapDispatchToProps)(Comment)
