import { Component, Input, OnInit } from '@angular/core';
import { FlaskService } from '../flask.service';
import { PostBody } from '../postbody';
import { ThresholdList } from '../thresList';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() postbody!: PostBody;
  thresList!: ThresholdList[];
  constructor(private flaskService: FlaskService) { }

  async ngOnInit(): Promise<void> {
    const arr = Array(9).fill("");
    console.log(this.postbody)
    await this.flaskService.getThresholdList(this.postbody).subscribe(e => {
      this.thresList = e
    })
  }

}
