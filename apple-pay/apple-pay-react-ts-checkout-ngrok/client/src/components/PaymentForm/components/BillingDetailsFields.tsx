import { Control, Controller, FieldValues } from 'react-hook-form';
import {
    Box,
    Select,
    MenuItem,
    TextField,
    InputLabel,
    FormControl,
} from '@mui/material';

export default function BillingDetailsFields(props: {
    form: { control: Control<FieldValues, any> };
}) {
    const { control } = props.form;

    return (
        <Box className='flex flex-col gap-3'>
            <Controller
                defaultValue={''}
                control={control}
                name='name'
                render={({ field }) => (
                    <TextField
                        label='Full Name'
                        variant='outlined'
                        id='billing-details-name-element'
                        type='text'
                        {...field}
                    />
                )}
            />
            <Controller
                defaultValue={''}
                control={control}
                name='street'
                render={({ field }) => (
                    <TextField
                        label='Address'
                        variant='outlined'
                        id='billing-details-street-element'
                        type='text'
                        {...field}
                    />
                )}
            />
            <Box className='grid grid-cols-2 gap-3'>
                <Controller
                    defaultValue={''}
                    control={control}
                    name='country'
                    render={({ field }) => (
                        <FormControl>
                            <InputLabel id='billing-details-country-element-label'>
                                Country
                            </InputLabel>
                            <Select
                                id='billing-details-country-element'
                                labelId='billing-details-country-element-label'
                                label='Country'
                                {...field}
                            >
                                <MenuItem value='' />
                                <MenuItem value='US'>United States</MenuItem>
                                {/* <MenuItem value="CA">Canada</MenuItem> */}
                            </Select>
                        </FormControl>
                    )}
                />
                <Controller
                    defaultValue={''}
                    control={control}
                    name='state'
                    render={({ field }) => (
                        <FormControl>
                            <InputLabel id='billing-details-state-element-label'>
                                State
                            </InputLabel>
                            <Select
                                label='State'
                                id='billing-details-state-element'
                                labelId='billing-details-state-element-label'
                                {...field}
                            >
                                <MenuItem value='' />
                                <MenuItem value='AL'>Alabama</MenuItem>
                                <MenuItem value='AK'>Alaska</MenuItem>
                                <MenuItem value='AS'>American Samoa</MenuItem>
                                <MenuItem value='AZ'>Arizona</MenuItem>
                                <MenuItem value='AR'>Arkansas</MenuItem>
                                <MenuItem value='CA'>California</MenuItem>
                                <MenuItem value='CO'>Colorado</MenuItem>
                                <MenuItem value='CT'>Connecticut</MenuItem>
                                <MenuItem value='DE'>Delaware</MenuItem>
                                <MenuItem value='DC'>
                                    District Of Columbia
                                </MenuItem>
                                {/* <MenuItem value="Federated States Of Micronesia">Federated States Of Micronesia</MenuItem> */}
                                <MenuItem value='FL'>Florida</MenuItem>
                                <MenuItem value='GA'>Georgia</MenuItem>
                                <MenuItem value='GU'>Guam</MenuItem>
                                <MenuItem value='HI'>Hawaii</MenuItem>
                                <MenuItem value='ID'>Idaho</MenuItem>
                                <MenuItem value='IL'>Illinois</MenuItem>
                                <MenuItem value='IN'>Indiana</MenuItem>
                                <MenuItem value='IA'>Iowa</MenuItem>
                                <MenuItem value='KS'>Kansas</MenuItem>
                                <MenuItem value='KY'>Kentucky</MenuItem>
                                <MenuItem value='LA'>Louisiana</MenuItem>
                                <MenuItem value='ME'>Maine</MenuItem>
                                {/* <MenuItem value="Marshall Islands">Marshall Islands</MenuItem> */}
                                <MenuItem value='MD'>Maryland</MenuItem>
                                <MenuItem value='MA'>Massachusetts</MenuItem>
                                <MenuItem value='MI'>Michigan</MenuItem>
                                <MenuItem value='MN'>Minnesota</MenuItem>
                                <MenuItem value='MS'>Mississippi</MenuItem>
                                <MenuItem value='MO'>Missouri</MenuItem>
                                <MenuItem value='MT'>Montana</MenuItem>
                                <MenuItem value='NE'>Nebraska</MenuItem>
                                <MenuItem value='NV'>Nevada</MenuItem>
                                <MenuItem value='NH'>New Hampshire</MenuItem>
                                <MenuItem value='NJ'>New Jersey</MenuItem>
                                <MenuItem value='NM'>New Mexico</MenuItem>
                                <MenuItem value='NY'>New York</MenuItem>
                                <MenuItem value='NC'>North Carolina</MenuItem>
                                <MenuItem value='ND'>North Dakota</MenuItem>
                                {/* <MenuItem value="Northern Mariana Islands">Northern Mariana Islands</MenuItem> */}
                                <MenuItem value='OH'>Ohio</MenuItem>
                                <MenuItem value='OK'>Oklahoma</MenuItem>
                                <MenuItem value='OR'>Oregon</MenuItem>
                                {/* <MenuItem value="Palau">Palau</MenuItem> */}
                                <MenuItem value='PA'>Pennsylvania</MenuItem>
                                <MenuItem value='PR'>Puerto Rico</MenuItem>
                                <MenuItem value='RI'>Rhode Island</MenuItem>
                                <MenuItem value='SC'>South Carolina</MenuItem>
                                <MenuItem value='SD'>South Dakota</MenuItem>
                                <MenuItem value='TN'>Tennessee</MenuItem>
                                <MenuItem value='TX'>Texas</MenuItem>
                                <MenuItem value='UT'>Utah</MenuItem>
                                <MenuItem value='VT'>Vermont</MenuItem>
                                <MenuItem value='VI'>Virgin Islands</MenuItem>
                                <MenuItem value='VA'>Virginia</MenuItem>
                                <MenuItem value='WA'>Washington</MenuItem>
                                <MenuItem value='WV'>West Virginia</MenuItem>
                                <MenuItem value='WI'>Wisconsin</MenuItem>
                                <MenuItem value='WY'>Wyoming</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
                <Controller
                    defaultValue={''}
                    control={control}
                    name='city'
                    render={({ field }) => (
                        <TextField
                            label='City'
                            variant='outlined'
                            id='billing-details-city-element'
                            type='text'
                            {...field}
                        />
                    )}
                />
                <Controller
                    defaultValue={''}
                    control={control}
                    name='zip'
                    render={({ field }) => (
                        <TextField
                            label='ZIP'
                            variant='outlined'
                            id='billing-details-zip-element'
                            {...field}
                        />
                    )}
                />
            </Box>
        </Box>
    );
}
