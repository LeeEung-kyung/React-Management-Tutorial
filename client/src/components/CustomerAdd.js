import React from 'react';
import { post } from 'axios';

class CustomerAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null, //프로필 이미지
            userName: '',
            birthday: '',
            gender: '',
            job: '',
            fileName: ''
        }
    }
    
    //데이터 추가
    addCustomer = () => {
        const url = 'api/customers';
        const formData = new FormData();
        formData.append('image', this.state.file);
        formData.append('name', this.state.userName);
        formData.append('birthday', this.state.birthday);
        formData.append('gender', this.state.gender);
        formData.append('job', this.state.job);

        //파일 전송시 맵표준규격 설정
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        //post방식으로 데이터 전송
        return post(url, formData, config);
    }
 
    handleFormSubmit = (e) => {
        //오류방지 함수
        e.preventDefault()
        this.addCustomer()
            //데이터받고 콘솔창에 출력
            .then((response) => {
                console.log(response.data);
                //응답을 받은 후에 고객목록만 새로고침
                this.props.stateRefresh();  
            })
        this.setState({
            file: null,
            userName: '',
            birthday: '',
            gender: '',
            job: '',
            fileName: ''
        })
    }

    handleFileChange = (e) => {
        this.setState({
            file: e.target.files[0],
            fileName: e.target.value
        })
    }

    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    render() {
        return (
            <form onSubmit={this.handleFormSubmit}>
                <h1>고객 추가</h1>
                프로필이미지 : <input type="file" name="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange}/><br/>
                이름 : <input type="text" name="userName" value={this.state.userName} onChange={this.handleValueChange}/><br/>
                생년월일 : <input type="text" name="birthday" value={this.state.birthday} onChange={this.handleValueChange}/><br/>
                성별 : <input type="text" name="gender" value={this.state.gender} onChange={this.handleValueChange}/><br/>
                직업 : <input type="text" name="job" value={this.state.job} onChange={this.handleValueChange}/><br/>
                <button type="submit">추가하기</button>
            </form>
        )
    }
}
export default CustomerAdd;