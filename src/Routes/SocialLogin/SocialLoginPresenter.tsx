import React from "react";
import { Helmet } from "react-helmet";
import BackArrow from "../../Components/BackArrow";
import styled from "../../typed-components";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import siravit from "../../images/siravit-phiwondee-MhPJdWYWbWI-unsplash.jpg";
import { MutationFn } from "react-apollo";
import { emailSignIn, emailSignInVariables } from "src/types/api";
import Input from "src/Components/Input";
import Form from "src/Components/Form";
import Button from "src/Components/Button";

const Container = styled.div`
  height: 100vh;
  background: url(${siravit});
  background-position-y: -900px;
  background-size: cover;
  padding: 50px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

`;

// const Title = styled.h2`
//   font-size: 25px;
//   margin-bottom: 40px;
//   color: white;
//   margin-top: 20px;
// `;

const Link = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 21px;
  margin-left: 5px;
  color: white;
  margin-right: 15px;
`;

const BackArrowExtended = styled(BackArrow)`
  position: absolute;
  top: 20px;
  left: 20px;
  fill: white;
`;


const ExtendedForm = styled(Form)`
  width: 100%
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 8px;
  padding: 10px;
  color: black;

  &::placeholder {
    color: black;
    font-size: 18px;
  }
`;

const ExtendedButton = styled(Button)`
  background-color: #3498db;
  margin-top: 3px;
`;

const SocialButton = styled.button`
  height: 57px;
  border-style: none;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: white;
  cursor: pointer;
`;

const FacebookButton = styled(SocialButton)`
  background-color: #3b5998;
`;

const GoogleButton = styled(SocialButton)`
  background-color: #4285f4;
`;

const SocialWrap = styled.div`
  width: 100%;
  margin-top: 35px;
  display: flex;
  flex-direction: column;
`;


interface IProps {
  loginCallback: (response) => void
  email: string,
  password: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: MutationFn<emailSignIn, emailSignInVariables>
}

const SocialLoginPresenter: React.SFC<IProps> = ({
  loginCallback,
  email,
  password,
  onChange,
  onSubmit,
}) => (
  <Container>
    <Helmet>
      <title>Social Login | Nuber</title>
    </Helmet>
    {/* <Title>계정에 로그인하세요.</Title> */}
    <BackArrowExtended backTo={"/"} />
    <Inner>
      <ExtendedForm submitFn={onSubmit}>
        <ExtendedInput
          placeholder={"아이디"}
          value={email}
          name={"email"}
          onChange={onChange}
        />
        <ExtendedInput
          placeholder={"비밀번호"}
          value={password}
          name={"password"}
          onChange={onChange}
        />
        <ExtendedButton value={"로그인"} />
      </ExtendedForm>
      <SocialWrap>
        <FacebookLogin
          appId="234376244609477"
          autoLoad={false}
          fields="name,first_name,last_name,email"
          callback={loginCallback}
          render={(renderProps) => (
            <FacebookButton onClick={renderProps.onClick}>
              <Link>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </Link>
              Facebook으로 계속
            </FacebookButton>
          )}
        />
        <GoogleButton>
          <Link>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.083c-2.258 0-4.083-1.825-4.083-4.083s1.825-4.083 4.083-4.083c1.103 0 2.024.402 2.735 1.067l-1.107 1.068c-.304-.292-.834-.63-1.628-.63-1.394 0-2.531 1.155-2.531 2.579 0 1.424 1.138 2.579 2.531 2.579 1.616 0 2.224-1.162 2.316-1.762h-2.316v-1.4h3.855c.036.204.064.408.064.677.001 2.332-1.563 3.988-3.919 3.988zm9.917-3.5h-1.75v1.75h-1.167v-1.75h-1.75v-1.166h1.75v-1.75h1.167v1.75h1.75v1.166z" />
            </svg>
          </Link>
          Google로 계속
        </GoogleButton>
      </SocialWrap>
    </Inner>
  </Container>
);

export default SocialLoginPresenter;
