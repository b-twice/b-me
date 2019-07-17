import React, {  useEffect, Fragment, useState, useRef,  RefObject } from 'react';
import { Event } from '../../common/client/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './EventListItemAdd.scss';

interface EventListItemAddProps {
    onChange (evt:React.FormEvent):void;
    event: Event;
    onSubmit ():void;
}

function EventListItemAdd(props:EventListItemAddProps) {

    const inputEl: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const [isSaving, setIsSaving] = useState<Boolean>();

    const onFormSubmit = (evt: React.FormEvent) => {
        if (evt) evt.preventDefault();
        if (validateModel()) {
            setIsSaving(true);
            onSubmit();
        }
    }
    const onSubmit = () => {
        if (validateModel()) {
            setIsSaving(true);
            props.onSubmit();
        }
    }

    const validateModel = ():boolean => {
        if (props.event.name == null || props.event.name == "") return false;
        return true;
    }

    useEffect(() => {
        if (isSaving === true) setIsSaving(false);
    }, [props.event])

    useEffect(() => {
        if (inputEl !== null && inputEl.current != null && isSaving === false) { 
            inputEl.current.focus();
        }
    }, [isSaving])

    return (

        <Fragment>
            { isSaving ? ( 
                <FontAwesomeIcon icon='spinner' pulse listItem />
            ) :  (
                <form onSubmit={onFormSubmit}>
                    <div className="Name-input">
                        <FontAwesomeIcon icon="plus" className="Event-add-icon" listItem />
                        <input 
                            ref={inputEl} 
                            className="Event-add"
                            type="text" 
                            onChange={props.onChange}
                            onBlur={onSubmit}
                            required
                            placeholder="Add an event"
                            name="name">
                        </input>
                    </div>
                </form>
            )
            }
        </Fragment>
   );
}

export default EventListItemAdd;