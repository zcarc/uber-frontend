import React from "react";
import { Helmet } from "react-helmet";
import BackArrow from "../../Components/BackArrow";
import Input from "../../Components/Input";
import countries from "../../countries";
import styled from "../../typed-components";
import suzanne from "../../images/suzanne-emily-o-connor-D45pSloWVdI-unsplash.jpg";

const Container = styled.div`
  height: 100vh;
  background: url(${suzanne});
  background-position-y: -300px;
  background-size: cover;
  padding: 50px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Inner = styled.div`
  background: white;
  width: 30%;
  height: 35%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  & .form-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
`;

const BackArrowExtended = styled(BackArrow)`
  position: absolute;
  top: 20px;
  left: 20px;
  fill: white;
`;

const Title = styled.h2`
  font-size: 25px;
  margin-top: 20px;
  margin-bottom: 40px;
`;

const CountrySelect = styled.select`
  font-size: 20px;
  color: "#2c3e50";
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: white;
  border: 0;
  font-family: "Maven Pro";
  margin-bottom: 20px;
`;

const CountryOption = styled.option``;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Button = styled.button`
  height: 50px;
  background-color: #4285f4;
  border-style: none;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  cursor: pointer;
`;

const ExtendedInput = styled(Input)`
  margin-top: 3px;
  margin-bottom: 2px;
  padding: 7px;
`;

interface IProps {
  countryCode: string;
  phoneNumber: string;
  onInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

const PhoneLoginPresenter: React.SFC<IProps> = ({
  countryCode,
  phoneNumber,
  onInputChange,
  onSubmit,
  loading,
}) => (
  <>
    <Helmet>
      <title>Phone Login | Number</title>
    </Helmet>
      <BackArrowExtended backTo={"/"} />
    <Container>
      <Inner>
        <Title>핸드폰 번호를 입력하세요.</Title>
        <div className={"form-wrap"}>
          <CountrySelect
            value={countryCode}
            name={"countryCode"}
            onChange={onInputChange}
          >
            {countries.map((country, index) => (
              <CountryOption key={index} value={country.dial_code}>
                {country.flag} {country.name} ({country.dial_code})
              </CountryOption>
            ))}
          </CountrySelect>
          <Form onSubmit={onSubmit}>
            <ExtendedInput
              placeholder={" - 없이 입력하세요."}
              value={phoneNumber}
              name={"phoneNumber"}
              onChange={onInputChange}
            />
            <Button>인증번호 발송</Button>
          </Form>
        </div>
      </Inner>
    </Container>
  </>
);

export default PhoneLoginPresenter;
