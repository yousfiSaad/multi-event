//     multi-event 1.0.3
//     (c) 2015 Saad Yousfi <yousfi.saad@gmail.com>

let helpers = {
	eventType(eventName) {
			let ret = {
				valid: false,
				type: 'mono', //molti/mono
				splited: []
			}
			ret.splited = eventName.split('.');
			for (let part of ret.splited) {
				let ok = /^[a-z0-9]+$/i.test(part);
				let ast = part === '*';
				if (!(ok || ast)) {
					return ret;
				}
				if (ast) {
					ret.type = 'multi';
				}
			}
			ret.valid = true;
			ret.name = eventName;

			return ret;
		},

		matches(pattern) {
			return function(eName) {
				let patternCurrent = eName.split('.');
				if (pattern.length !== patternCurrent.length) {
					return false;
				} else {
					for (let i in pattern) {
						if (patternCurrent[i] !== '*' && patternCurrent[i] !== pattern[i]) {
							return false;
						}
					}
				}
				return true;
			};
		}
}

class MultiEvent {
	constructor() {
		this._mapMono = new Map();
		this._mapMulti = new Map();
	}

	on(eventName, callBack) {
		let infos = helpers.eventType(eventName);
		if (!infos.valid) {
			throw 'invalid name';
		}
		if (typeof callBack !== 'function') {
			throw 'you must give me a function';
		}

		let mapOfSet;
		if (infos['type'] !== 'multi') {
			mapOfSet = this._mapMono;
		} else {
			mapOfSet = this._mapMulti;
		}

		let setMulti;
		if (mapOfSet.has(eventName)) {
			setMulti = mapOfSet.get(eventName);
		} else {
			setMulti = new Set();
			mapOfSet.set(eventName, setMulti);
		}

		setMulti.add(callBack);

		return this;
	}

	emit(eventName, ...args) {
		let infos = helpers.eventType(eventName);
		if (!infos.valid) {
			throw 'invalid event';
		}
		if (infos.type === 'multi') {
			throw 'you can not emit multiple events, may be in the next version';
		}

		// get mono callBacks
		let monoCallBacks = this._mapMono.has(eventName) ? [...this._mapMono.get(eventName)] : [];
		// get multi callBacks
		let allMultiNames = [...this._mapMulti.keys()];

		let multiNamesMatches = allMultiNames.filter(helpers.matches(infos.splited));

		let multiCallBacks = [];
		for (let multiNamesMatch of multiNamesMatches) {
			Array.prototype.push.apply(multiCallBacks, [...this._mapMulti.get(multiNamesMatch)]);
		}

		let callBacks = monoCallBacks.concat(multiCallBacks)

		//execute callBacks
		for (let callBack of callBacks) {
			callBack.apply({
				eventName
			}, args);
		}

		return this;
	}

}

export default MultiEvent;
