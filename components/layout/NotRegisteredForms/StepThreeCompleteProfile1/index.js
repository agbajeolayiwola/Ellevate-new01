import React, { useState, useEffect } from 'react'
import ButtonComp from '../../../ReusableComponents/Button'
import { useForm } from 'react-hook-form'
import { CardHeadingBVN, LeftHeading, ButtonWrapper } from './styles.module'
import styles from './styles.module.css'
import Card from '../../NotRegisteredForms/Card'
import Progressbar from '../../../ReusableComponents/Progressbar'
import StepFourCompProfile2BizDetails from '../StepFourCompProfile2BizDetails'
import { useDispatch, useSelector } from 'react-redux'
import {
  businessCategoriesData,
  CompleteBusinessProfile,
  CompProfile,
  createNewCorpUserAccount,
  createNewUserAccount,
  statesData,
} from '../../../../redux/actions/actions'
import { useRouter } from 'next/router'
import DropdownSvg from '../../../ReusableComponents/ReusableSvgComponents/DropdownSvg'
import SearchSvg from '../../../ReusableComponents/ReusableSvgComponents/SearchSvg'
import axiosInstance from '../../../../redux/helper/apiClient'
import apiRoutes from '../../../../redux/helper/apiRoutes'
import { getCookie } from 'cookies-next'
const StepThreeCompleteProfile1 = ({ formData, setFormData, action }) => {
  // const [progress, setProgress] = useState('75%');
  const [title, setTitle] = useState('Basic')
  const [bgcolor, setBgcolor] = useState(false)
  const [profileCont, setProfileCont] = useState([])

  const handleShowFourthStep = () => {
    setSwitchs((prev) => !prev)
    setBgcolor((prevState) => !prevState)
  }
  const dispatch = useDispatch()
  const { isLoading, profile, errorMessage } = useSelector(
    (state) => state.profile,
  )
  const { newCorpAccount, newCorpAccountErrorMMessage } = useSelector(
    (state) => state.newuserCorpAccount,
  )
  const { businessCategories, errorDatas } = useSelector(
    (state) => state.businessCategoriesReducer,
  )
  const { states } = useSelector((state) => state.statesReducer)

  const [checker, setChecker] = useState()
  const [localState, setLocalState] = useState('')
  const [localGovernment, setLocalGovernment] = useState('')
  const [location, setLocation] = useState([])
  const [gender, setGender] = useState('')
  const [businessCategory, setBusinessCategory] = useState([])
  const [businessType, setBusinessType] = useState([])
  const [business, setBusiness] = useState('')
  const [businesses, setBusinesses] = useState('')
  const [businessTest, setBusinessTest] = useState(false)
  const [businessText, setBusinessText] = useState(false)
  const router = useRouter()
  useEffect(() => {
    dispatch(statesData())
  }, [])
  const newStates = () => {
    if (states !== null) {
      setLocation(states)
    }
  }
  useEffect(() => {
    newStates()
  }, [states])
  useEffect(() => {
    location?.filter((item) => {
      if (item.state === localState) {
        setLocalGovernment(item.localGoverment)
      }
    })
  }, [localState])

  useEffect(() => {
    dispatch(CompProfile())
  }, [])
  useEffect(() => {
    if (profile !== null) {
      setProfileCont(profile.data)
    }
    setGender(profileCont.gender)
  }, [profile])
  useEffect(() => {
    dispatch(businessCategoriesData())
  }, [])
  useEffect(() => {
    if (businessCategories !== null) {
      setBusinessCategory(businessCategories)
    }
  }, [businessCategories])
  useEffect(() => {
    Object.keys(businessCategory)?.filter((item) => {
      if (item === business) {
        setBusinessType(businessCategory[item])
      }
    })
  }, [business])

  if (gender === 'm') console.log(profileCont)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const { accountStatus, errorMessages } = useSelector(
    (state) => state.accountStatusReducer,
  )
  const { newAccount, newAccountErrorMessage } = useSelector(
    (state) => state.newUserAccountDets,
  )
  const [errorMes, setErrorMes] = useState()
  const handleSubmitIII = () => {
    const commpleteProfileData = {
      businessName: formData.bussinessName,
      businessType: businesses,
      referralCode: formData.referralCode,
      countryCode: '+234',
      phoneNumber: formData.phoneNumber,
      businessAddress: formData.streetName,
      state: formData.state,
      city: formData.city,
      lga: formData.localGoverment,
    }
    console.log(commpleteProfileData)
    dispatch(CompleteBusinessProfile(commpleteProfileData))

    const accountData = {
      affiliateCode: 'ENG',
      ccy: 'NGN',
    }
    dispatch(createNewUserAccount(accountData))
    console.log(
      'errorMessages from account',
      newAccount,
      newAccountErrorMessage,
    )
    if (
      newAccount.message ===
      'Your Transaction Request is Successful and Approved'
    ) {
      console.log(errorMessages)
      router.push('/Verify/Account/loading')
    } else if (accountStatus.message === 'Try Again') {
      router.push('/Verify/Account/loading')
    } else if (
      newAccountErrorMessage ===
      'You already have an account with us. Please contact us for more information'
    ) {
      router.push('/Succes')
    }
  }

  const handleSubmitReg = () => {
    const commpleteProfileData = {
      businessName: formData.bussinessName,
      businessType: businesses,
      referralCode: formData.refferalCode,
      countryCode: '+234',
      phoneNumber: formData.bussinessName,
      businessAddress: formData.streetName,
      state: formData.state,
      city: formData.city,
      lga: formData.localGoverment,
    }
    console.log(commpleteProfileData)
    dispatch(CompleteBusinessProfile(commpleteProfileData))

    const accountData = {
      affiliateCode: 'ENG',
      ccy: 'NGN',
    }
    const cookie = getCookie('cookieToken')
    axiosInstance
      .post(
        `https://ellevate-app.herokuapp.com${apiRoutes.corpNewUser}`,
        accountData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookie}`,
          },
        },
      )
      .then((response) => {
        console.log('create New Account', response.data)
      })
      .catch((error) => {
        console.log('create new account Error:', error.response.data.message)
        setErrorMes(error.response.data.message)
      })

    if (
      errorMes ===
      'You already have an account with us. Please contact us for more information'
    ) {
      router.push('/Succes/CorpSuccess')
    }
  }
  // useEffect(() => {
  //     handleSubmitIII();
  // }, [newAccountErrorMessage]);

  // const businessProfileAction = () => {
  //     const commpleteProfileData = {
  //         businessName: formData.bussinessName,
  //         businessType: formData.businessType,
  //         referralCode: formData.refferalCode,
  //         countryCode: '+234',
  //         phoneNumber: formData.bussinessName,
  //         businessAddress: formData.streetName,
  //         state: formData.state,
  //         city: formData.city,
  //         lga: formData.localGoverment
  //     };
  //     console.log(commpleteProfileData);
  //     dispatch(CompleteBusinessProfile(commpleteProfileData));

  //     const accountData = {
  //         affiliateCode: 'ENG',
  //         ccy: 'NGN'
  //     };
  //     dispatch(createNewUserAccount(accountData));
  // };

  // const sendOTP = (data) => {
  //     console.log(data);
  // };
  const [activeBtn, setActiveBtn] = useState(true)
  return (
    <div className={styles.bodyWrapper}>
      <div className={styles.prog}>
        <CardHeadingBVN>
          <LeftHeading>Complete your Profile</LeftHeading>
          {/* <Imag 
                    src="/width" 
                    alt="lineImage" /> */}
        </CardHeadingBVN>
        {/* <Progressbar
                            bgcolor="#6CCF00"
                            progressCount={progress}
                            height={14}
                            progWidth="27%"
                        /> */}
      </div>
      {/* The small card that wraps the form */}
      <div className={styles.businessCont}>
        <ButtonWrapper>
          <div className={title === 'Basic' ? styles.first : styles.second}>
            <h2
              onClick={() => {
                setTitle('Basic')
              }}
            >
              1
            </h2>
            <p>Basic Details</p>
          </div>
          <div className={title === 'Other' ? styles.first : styles.second}>
            <h2
              onClick={() => {
                setTitle('Other')
              }}
            >
              2
            </h2>
            <p>Other Details</p>
          </div>
        </ButtonWrapper>
        {title === 'Basic' ? (
          <>
            <div className={styles.nameDiv}>
              <div className={styles.formGroups}>
                <label>Enter Full Name</label>
                <input
                  type="text"
                  placeholder={profileCont.fullName}
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label>Select your Gender</label>
                <select name="" id="">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <div className={styles.formCont}>
              <div className={styles.formGroup}>
                <div className={styles.singleFormGroup}>
                  <label>Enter Business Name</label>
                  <input
                    type="text"
                    value={
                      profileCont.business
                        ? profileCont.business.name
                        : formData.businessName
                    }
                    placeholder="Enter Business Full Name"
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        bussinessName: event.target.value,
                      })
                    }}
                  />
                </div>
                <div className={styles.singleFormGroup}>
                  <label>Select your Business Category</label>

                  <div className={styles.businessCat}>
                    <div
                      className={styles.businessCategories}
                      onClick={() => {
                        setBusinessTest(!businessTest)
                      }}
                    >
                      <SearchSvg />
                      {business ? (
                        <p>{business}</p>
                      ) : (
                        <p>Search Business Category</p>
                      )}

                      <DropdownSvg />
                    </div>
                    {businessTest && (
                      <ul className={styles.businessGroup}>
                        {Object.keys(businessCategory)?.map(
                          (business, index) => {
                            return (
                              <li
                                value={business}
                                key={index}
                                onClick={() => {
                                  setBusiness(business)
                                  setBusinessTest(false)
                                }}
                              >
                                {business}
                              </li>
                            )
                          },
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.singleFormGroup}>
                  <label>Enter your Business Phone Number</label>
                  <div className={styles.phone}>
                    <div className={styles.phoneHeader}>
                      <span>
                        <img src={formData.flag} alt="" />
                      </span>
                      <p>{formData.baseCurrency}</p>
                    </div>
                    <div className={styles.phoneDetails}>
                      <p>{formData.countryCode}</p>
                      <input
                        type="number"
                        placeholder="812 345 6789"
                        {...register('countryCode_number', {
                          required: 'Country Code is required',
                          minLength: {
                            value: 9,
                            message: 'Min length is 9',
                          },
                        })}
                        value={formData.phoneNumber}
                        onChange={(event) => {
                          setFormData({
                            ...formData,
                            phoneNumber: event.target.value,
                          })
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.singleFormGroup}>
                  <label>Select your Business Type</label>
                  <div className={styles.businessCat}>
                    <div
                      className={styles.businessCategories}
                      onClick={() => {
                        setBusinessText(!businessText)
                      }}
                    >
                      <SearchSvg />
                      {businesses ? (
                        <p>{businesses}</p>
                      ) : (
                        <p>Search Business Type</p>
                      )}

                      <DropdownSvg />
                    </div>
                    {businessText && (
                      <ul className={styles.businessGroup}>
                        {businessType?.map((business, index) => {
                          return (
                            <li
                              value={business}
                              key={index}
                              onClick={() => {
                                setBusinesses(business)
                                setBusinessText(false)
                              }}
                            >
                              {business}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </div>
                {profileCont.isBusinessRegistered === true ? (
                  <ButtonComp
                    disabled={activeBtn}
                    active={activeBtn ? 'active' : 'inactive'}
                    text="Next"
                    type="button"
                    onClick={() => {
                      setTitle('Other'), handleSubmitReg()
                    }}
                    // onClick={handleShowFourthStep}
                  />
                ) : (
                  <ButtonComp
                    disabled={activeBtn}
                    active={activeBtn ? 'active' : 'inactive'}
                    text="Next"
                    type="button"
                    onClick={() => {
                      setTitle('Other'), handleSubmitIII()
                    }}
                    // onClick={handleShowFourthStep}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.nameDiv}>
              <div className={styles.formGroup}>
                <div>
                  <label>Number | Street Name</label>
                  <div className={styles.addressNumber}>
                    <input
                      type="number"
                      placeholder="101"
                      className={styles.number}
                    />
                    <input
                      type="text"
                      placeholder="Enter Street Name"
                      onChange={(event) => {
                        setFormData({
                          ...formData,
                          streetName: event.target.value,
                        })
                      }}
                    />
                  </div>
                </div>
                <div className={styles.singleFormGroup}>
                  <label>Local Government Area (LGA)</label>
                  <select
                    name=""
                    id=""
                    {...register('localGoverment')}
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        localGoverment: event.target.value,
                      })
                    }}
                  >
                    <option value="">Select LGA</option>
                    {localGovernment
                      ? localGovernment?.map((item, index) => {
                          return (
                            <option value={item.lgaName} key={index}>
                              {item.lgaName}
                            </option>
                          )
                        })
                      : null}
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <div
                  className={styles.singleFormGroup}
                  style={{
                    marginTop: '0px',
                  }}
                >
                  <label>State</label>
                  <select
                    name=""
                    id=""
                    {...register('State')}
                    value={formData.state}
                    onChange={(event) => {
                      setLocalState(event.target.value)
                      setFormData({
                        ...formData,
                        state: event.target.value,
                      })
                    }}
                  >
                    <option value="">Select State</option>
                    {location.map((item, index) => {
                      return (
                        <option value={item.state} key={index}>
                          {item.state}
                        </option>
                      )
                    })}
                  </select>
                </div>
                <div className={styles.singleFormGroup}>
                  <label>City/Town</label>
                  <input
                    type="text"
                    placeholder="Enter City/Town"
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        city: event.target.value,
                      })
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.formCont}>
              <div className={styles.formGroup}>
                <div className={styles.singleFormGroup}>
                  <label>
                    Enter Referral Code <span>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Code"
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        referralCode: event.target.value,
                      })
                    }}
                  />
                </div>
                {profileCont.isBusinessRegistered === true ? (
                  <ButtonComp
                    disabled={activeBtn}
                    active={activeBtn ? 'active' : 'inactive'}
                    text="Save & Continue"
                    type="button"
                    onClick={handleSubmitReg}
                    // onClick={handleShowFourthStep}
                  />
                ) : (
                  <ButtonComp
                    disabled={activeBtn}
                    active={activeBtn ? 'active' : 'inactive'}
                    text="Save & Continue"
                    type="button"
                    onClick={handleSubmitIII}
                    // onClick={handleShowFourthStep}
                  />
                )}
              </div>
              <div className={styles.formGroup}>
                <div className={styles.singleFormGroup}>
                  <label>Upload Signature</label>
                  <div className={styles.sign}>
                    <p>No file chosen...</p>
                    <label>
                      <input type="file" placeholder="Enter Code" />
                      Upload
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* {switchs ? (
                            <>
                                <StepFourCompProfile2BizDetails
                                    formData={formData}
                                    setFormData={setFormData}
                                />
                            </>
                        ) : (
                            <>
                                <>
                                    <div
                                        className={styles.dets}
                                        style={{ marginTop: '2rem' }}
                                    >
                                        <Label className={styles.label}>
                                            Enter your Full Name
                                        </Label>
                                        <br />
                                        <FormInput
                                            type="text"
                                            placeholder=""
                                            value={profileCont.fullName}
                                            disabled
                                            {...register('bvn')}
                                        />

                                        <GenderWrapper>
                                            <Label className={styles.label}>
                                                Select your Gender
                                            </Label>
                                            <br />
                                            <div className={styles.genderInps}>
                                                <div className={styles.male}>
                                                    <FormInput
                                                        style={{
                                                            width: '15px'
                                                        }}
                                                        type="radio"
                                                        name="gender"
                                                        value="male"
                                                        {...register('bvn')}
                                                    />
                                                    <label
                                                        className={
                                                            styles.fmLabel
                                                        }
                                                    >
                                                        Male
                                                    </label>
                                                </div>
                                                <div className={styles.female}>
                                                    <FormInput
                                                        style={{
                                                            width: '15px'
                                                        }}
                                                        type="radio"
                                                        name="gender"
                                                        value="female"
                                                        {...register('bvn')}
                                                    />
                                                    <label
                                                        className={
                                                            styles.fmLabel
                                                        }
                                                    >
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                        </GenderWrapper>
                                    </div>

                                    <ButtonComp
                                        disabled={activeBtn}
                                        active={
                                            activeBtn ? 'active' : 'inactive'
                                        }
                                        text="Next"
                                        type="button"
                                        // onClick={handleShowSuccessStep}
                                        onClick={handleShowFourthStep}
                                    />
                                </>
                            </>
                        )} */}
      </div>
    </div>
  )
}

export default StepThreeCompleteProfile1
