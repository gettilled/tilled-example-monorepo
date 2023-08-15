import React from 'react';
import { useForm } from 'react-hook-form';

export default function BillingDetailsFields() {
  const { register, formState: { errors } } = useForm();
  // console.log(errors);

  return (
    <div>
      <label className='flex flex-col p-3'>
        Full Name
        <input id='billing-details-name-element' className='max-width-max border rounded-md' type="text" placeholder="" {...register("fullName", {required: true})} />
        {errors.fullName?.type === 'required' && "Full name is required"}
      </label>
      <label className='flex flex-col p-3'>
        Address
        <input id='billing-details-street-element' className='max-width-max border rounded-md' type="text" placeholder="" {...register("address", {required: true})} />
        {errors.address?.type === 'required' && "Address is required"}
      </label>
      <div className='grid grid-cols-2'>
        <label className='flex flex-col p-3'>
          Country
          <select id='billing-details-country-element' className='max-width-max border rounded-md' {...register("country", { required: true })}>
            <option value="" />
            <option value="US">United States</option>
            {/* <option value="CA">Canada</option> */}
          </select>
          {errors.country?.type === 'required' && "Country is required"}
        </label>
        <label className='flex flex-col p-3'>
          State
          <select id='billing-details-state-element' className='max-width-max border rounded-md' {...register("state", { required: true })}>
            <option value="" />
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AS">American Samoa</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="SE">Delaware</option>
            <option value="DC">District Of Columbia</option>
            {/* <option value="Federated States Of Micronesia">Federated States Of Micronesia</option> */}
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="GU">Guam</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            {/* <option value="Marshall Islands">Marshall Islands</option> */}
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            {/* <option value="Northern Mariana Islands">Northern Mariana Islands</option> */}
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            {/* <option value="Palau">Palau</option> */}
            <option value="PA">Pennsylvania</option>
            <option value="PR">Puerto Rico</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VI">Virgin Islands</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </select>
          {errors.state?.type === 'required' && "State is required"}
        </label>
        <label className='flex flex-col p-3'>
          City
          <input id='billing-details-city-element' className='max-width-max border rounded-md' type="text" placeholder="" {...register("city", {required: true})} />
          {errors.city?.type === 'required' && "City is required"}
        </label>
        <label className='flex flex-col p-3'>
          ZIP
          <input id='billing-details-zip-element' className='max-width-max border rounded-md' type="text" placeholder="" {...register("zip", {required: true, maxLength: 10})} />
          {errors.zip?.type === 'required' && "Zip is required"}
        </label>
      </div>
    </div>
  );
}