import {v4 as uuidv4} from 'uuid';
import Vue from 'vue';

const initialState = () => ({
    layout: [], elements: [], selectedElementId: null,
});

const state = initialState();

const getters = {
    selectedElement: (state) => {
        return state.elements.find((el) => el.i === state.selectedElementId);
    },
};

// helper tạo 1 cell mới (mỗi call tạo object mới, không reuse)
function createCell() {
    return {
        id: `c-${uuidv4 ? uuidv4() : Date.now()}-${Math.floor(Math.random() * 10000)}`,
        value: '',
        type: 'text',
        thresholdKey: '',
        textAlign: '',
        alignment: ''
    };
}

// helper tạo 1 row (mảng cell) với số cell = headersLength
function createRowCells(headersLength = 1) {
    const row = [];
    for (let i = 0; i < headersLength; i++) {
        row.push(createCell());
    }
    return row;
}

const mutations = {
    ADD_ELEMENT(state, payload) {
        state.layout.push(payload.layout);
        state.elements.push(payload.element);
    },

    REMOVE_ELEMENT(state, id) {
        state.elements = state.elements.filter(el => el.i !== id);
        state.layout = state.layout.filter(el => el.i !== id);
        state.selectedElementId = null;
    },

    REMOVE_ALL_ELEMENT(state) {
        state.elements = [];
        state.layout = [];
        state.selectedElementId = null;
    },

    UPDATE_LAYOUT(state, {i, changes}) {
        const item = state.layout.find((el) => el.i === i);
        if (item) {
            Object.assign(item, changes);
        }
    },

    SELECT_ELEMENT(state, id) {
        state.selectedElementId = id;
    },

    UPDATE_ELEMENT_STYLE(state, {id, style}) {
        const element = state.elements.find(el => el.i === id);
        if (element) {
            element.style = {...element.style, ...style};
        }
    },

    ADD_COLUMN(state, id) {
        const element = state.elements.find(el => el.i === id);
        if (element && element.type === 'table') {
            const newColumn = {text: `Cột ${element.data.headers.length + 1}`};
            element.data.headers.push(newColumn);

            // thêm 1 cell mới cho mỗi row
            element.data.rows.forEach((row, rIdx) => {
                if (!Array.isArray(row)) {
                    // row sai cấu trúc -> reset row
                    Vue.set(element.data.rows, rIdx, createRowCells(element.data.headers.length));
                } else {
                    row.push(createCell());
                }
            });
        }
    },

    ADD_ROW(state, id) {
        const element = state.elements.find(el => el.i === id);
        if (element && element.type === 'table') {
            const headersLen = element.data.headers ? element.data.headers.length : 1;
            const newRow = createRowCells(headersLen);
            element.data.rows.push(newRow);
        }
    },


    UPDATE_TABLE_HEADERS(state, {tableId, headers}) {
        const element = state.elements.find(el => el.i === tableId);
        if (element) {
            Vue.set(element.data, 'headers', headers);
        }
    },

    // --- Mutations được cập nhật ---
    REMOVE_COLUMN(state, {tableId, colIndex}) {
        const element = state.elements.find(el => el.i === tableId);
        if (!element || !element.data) return;

        // Ensure arrays exist
        element.data.headers = element.data.headers || [];
        element.data.rows = element.data.rows || [];

        // guard index
        if (colIndex < 0 || colIndex >= element.data.headers.length) return;

        // remove header
        element.data.headers.splice(colIndex, 1);

        // update each row: splice the corresponding cell, ensure row length matches headers length
        element.data.rows.forEach((row, rIdx) => {
            // if row is not an array (bad shape) -> replace with new row
            if (!Array.isArray(row)) {
                Vue.set(element.data.rows, rIdx, createRowCells(element.data.headers.length || 1));
                return;
            }

            // remove the cell if exists
            if (row[colIndex] !== undefined) {
                row.splice(colIndex, 1);
            }

            // ensure each remaining cell is an object (no primitives)
            for (let c = 0; c < row.length; c++) {
                if (!row[c] || typeof row[c] !== 'object') {
                    row[c] = createCell();
                }
            }

            // if row shorter than headers -> push new cells
            while (row.length < element.data.headers.length) {
                row.push(createCell());
            }

            // if row longer than headers -> remove extras
            while (row.length > element.data.headers.length) {
                row.splice(row.length - 1, 1);
            }
        });

        // If no headers left, ensure at least one header + one row
        if (element.data.headers.length === 0) {
            element.data.headers = [{text: 'Column 1'}];
            // replace rows with single row matching headers
            Vue.set(element.data, 'rows', [createRowCells(1)]);
        }
    },

    REMOVE_ROW(state, {tableId, rowIndex}) {
        const element = state.elements.find(el => el.i === tableId);
        if (!element || !element.data || !Array.isArray(element.data.rows)) return;

        // guard index
        if (rowIndex < 0 || rowIndex >= element.data.rows.length) return;

        // remove the specified row
        element.data.rows.splice(rowIndex, 1);

        // If rows empty -> add one empty row that matches headers length
        const headersLen = Array.isArray(element.data.headers) ? element.data.headers.length : 1;
        if (element.data.rows.length === 0) {
            Vue.set(element.data, 'rows', [createRowCells(headersLen)]);
            return;
        }

        // ensure each row has correct number of cells and each cell is an object
        element.data.rows.forEach((row, rIdx) => {
            if (!Array.isArray(row)) {
                Vue.set(element.data.rows, rIdx, createRowCells(headersLen));
                return;
            }
            while (row.length < headersLen) {
                row.push(createCell());
            }
            while (row.length > headersLen) {
                row.splice(row.length - 1, 1);
            }
            for (let c = 0; c < row.length; c++) {
                if (!row[c] || typeof row[c] !== 'object') {
                    row[c] = createCell();
                }
            }
        });
    },

    REMOVE_CELL(state, {tableId, rowIndex, colIndex}) {
        const element = state.elements.find(el => el.i === tableId);
        if (!element || !element.data || !Array.isArray(element.data.rows)) return;
        const rows = element.data.rows;
        if (!rows[rowIndex] || !Array.isArray(rows[rowIndex]) || rows[rowIndex][colIndex] === undefined) return;

        const cell = rows[rowIndex][colIndex];
        if (cell && typeof cell === 'object') {
            // chỉ reset value (giữ nguyên id/type/format)
            Vue.set(cell, 'value', '');
        } else {
            // trường hợp cell là primitive (cẩn thận): replace bằng object cell mới
            Vue.set(rows[rowIndex], colIndex, createCell());
        }
    }


};

const actions = {
    addElement({commit, state}, type) {
        const newId = uuidv4();
        const newLayout = {
            i: newId, x: 0, y: state.layout.length, w: 4, h: 2, type,
        };
        let newElement = {
            i: newId, type, style: {
                fontSize: '10px', color: '#000000', textAlign: 'left',
            },
        };

        if (type === 'title') {
            newElement.content = 'Tiêu đề mới';
            newLayout.h = 2;
        } else if (type === 'text') {
            newElement.content = 'Nội dung văn bản mới';
            newLayout.h = 1.5;
        } else if (type === 'table') {
            let rowsInit = [];
            let headers = [{text: 'Cột 1'}, {text: 'Cột 2'}, {text: 'Cột 3'}]
            // ví dụ ban đầu có 3 row

            for (let i = 0; i < 1; i++) {
                rowsInit.push(createRowCells(headers.length));
            }
            newElement.data = {
                tableId: `tb-${uuidv4()}`,
                headers: headers,
                rows: rowsInit,
            };
            newLayout.h = 6;
        }

        commit('ADD_ELEMENT', {layout: newLayout, element: newElement});
        commit('SELECT_ELEMENT', newId);
    }, removeElement({commit}, id) {
        commit('REMOVE_ELEMENT', id);
    }, removeAllElements({commit}) {
        commit('REMOVE_ALL_ELEMENT')
    }, updateLayout({commit}, payload) {
        commit('UPDATE_LAYOUT', payload);
    }, selectElement({commit}, id) {
        commit('SELECT_ELEMENT', id);
    }, updateElementStyle({commit}, payload) {
        commit('UPDATE_ELEMENT_STYLE', payload);
    }, addColumn({commit}, id) {
        commit('ADD_COLUMN', id);
    }, addRow({commit}, id) {
        commit('ADD_ROW', id);
    }, updateTableHeaders({commit}, payload) {
        commit('UPDATE_TABLE_HEADERS', payload);
    }, removeColumn({commit}, payload) {
        commit('REMOVE_COLUMN', payload);
    }, removeRow({commit}, payload) {
        commit('REMOVE_ROW', payload);
    }, removeCell({commit}, payload) {
        commit('REMOVE_CELL', payload);
    },
};

export default {
    namespaced: true, state, getters, mutations, actions,
};
