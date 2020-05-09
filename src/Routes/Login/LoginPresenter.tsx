import React from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import HomeImage from "../../images/photo-1532115322357-7f39d4cb6e53.jpg";
import styled from "../../typed-components";

const Container = styled.div`
  height: 100vh;
`;

const Header = styled.header`
  height: 70%;
  background: url(${HomeImage});
  display: flex;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const Logo = styled.div`
  width: 130px;
  height: 130px;
  background-color: darkcyan;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 14px 18px rgba(0, 0, 0, 0.2), 0 -14px 18px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  font-weight: 500;
  font-size: 25px;
`;

const Title = styled.h1`
  color: white;
  font-weight: bold;
  font-size: 35px;
`;

const Footer = styled.div``;

const Subtitle = styled.h2`
  font-size: 30px;
`;

const FakeInput = styled.div`
  margin: 50px 0px 20px;
  font-size: 25px;
  font-weight: 300;
`;

const PhoneLogin = styled.div`
  padding: 25px;
  margin-top: 25px;
  cursor: pointer;
`;

const Grey = styled.span`
  color: ${(props) => props.theme.greyColor};
  margin-left: 10px;
`;

const SocialLogin = styled.div`
  border-top: 1px solid ${(props) => props.theme.greyColor};
  padding: 30px 20px;
`;

const SocialLink = styled.span`
  color: ${(props) => props.theme.blueColor};
  font-size: 20px;
  cursor: pointer;
`;

interface IProps extends RouteComponentProps<any> {}

const OutHomePresenter: React.SFC<IProps> = () => (
  <Container>
    <Helmet>
      <title>Login | Uber</title>
    </Helmet>
    <Header>
      <Logo>
        <Title>Uber</Title>
      </Logo>
    </Header>
    <Footer>
      <Link to={"/phone-login"}>
        <PhoneLogin>
          <Subtitle>지금 Uber와 함께 하세요.</Subtitle>
          <FakeInput>
            🇰🇷 +82 <Grey>핸드폰으로 회원가입</Grey>
          </FakeInput>
        </PhoneLogin>
      </Link>
      <Link to={"/social-login"}>
        <SocialLogin>
          <SocialLink>Or connect with social</SocialLink>
        </SocialLogin>
      </Link>
    </Footer>
  </Container>
);

export default OutHomePresenter;
